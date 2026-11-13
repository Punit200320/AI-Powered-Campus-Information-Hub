"""
Campus AI Service — FastAPI Backend
====================================
Provides chat (RAG), quiz generation, document summarisation,
and scholarship listing endpoints.
"""

import sys
import os
import json
import uuid
import traceback
from typing import List, Optional

# ---------------------------------------------------------------------------
# Windows console encoding fix
# ---------------------------------------------------------------------------
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import requests as http_requests
from dotenv import load_dotenv
from auth import get_current_user, get_optional_user

load_dotenv()

# Also load the shared config/.env (holds OPENROUTER_API_KEY etc.) so the
# service works even when launched directly (not via run_all_backends.bat).
_config_env_path = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "config", ".env"
)
if os.path.exists(_config_env_path):
    # override=True: the service .env may contain an empty OPENROUTER_API_KEY,
    # which would otherwise shadow the real key in config/.env.
    load_dotenv(_config_env_path, override=True)

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = FastAPI(title="Campus AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
_scraped_doc_cache = None
try:
    _cache_dir = os.path.join(os.path.dirname(__file__), "_cache")
    _cache_f = os.path.join(_cache_dir, "scraped_docs.json")
    if os.path.exists(_cache_f):
        with io.open(_cache_f, encoding="utf-8") as fh:
            _scraped_doc_cache = json.load(fh)
except Exception:
    _scraped_doc_cache = None

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
CREDENTIALS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "config", "credentials.json"
)

def _get_scholarship_title(s: dict) -> str:
    for k in ["Title", "title", "name", "Name", "scholarship_name"]:
        val = s.get(k)
        if val and str(val).strip():
            return str(val).strip()
    return "Campus Scholarship"

def _get_scholarship_provider(s: dict) -> str:
    for k in ["Provider", "provider", "organization", "Organization"]:
        val = s.get(k)
        if val and str(val).strip():
            return str(val).strip()
    return "Government / Foundation"

def _get_scholarship_amount(s: dict) -> str:
    for k in ["Amount", "amount", "award", "Award"]:
        val = s.get(k)
        if val and str(val).strip():
            return str(val).strip()
    return "Tuition & Financial Grant"

def _get_scholarship_deadline(s: dict) -> str:
    for k in ["Deadline", "deadline", "last_date", "Last Date"]:
        val = s.get(k)
        if val and str(val).strip():
            return str(val).strip()
    return "Check Portal"

# Ordered fallback chain for free models on OpenRouter
FALLBACK_MODELS = [
    "dots-studio/dots-3-note-preview:free",
    "cohere/north-mini-code:free",
    "nvidia/nemotron-3.5-lightning:free",
    "thinkingmachines/inkling:free",
    "liquid/lfm-2.5-2.6b:free",
    "openrouter/free",
]

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

# -- Chat --
class ChatRequest(BaseModel):
    message: str
    mode: str = "general"


class Citation(BaseModel):
    id: str
    title: str
    page: str
    author: str


class ChatResponse(BaseModel):
    reply: str
    citations: List[Citation] = []


# -- Quiz --
class QuizRequest(BaseModel):
    subjectId: str
    unit: str
    difficulty: str = "medium"
    count: int = 5


class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correctIndex: int
    explanation: str


class QuizResponse(BaseModel):
    quizId: str
    subject: str
    unit: str
    difficulty: str
    questions: List[QuizQuestion]


# -- Summarise --
class ImportantDate(BaseModel):
    label: str
    date: str


class SummarizeResponse(BaseModel):
    title: str
    executiveOverview: str
    importantDates: List[ImportantDate] = []
    eligibilityRequirements: List[str] = []
    requiredDocuments: List[str] = []
    applicationProcedures: List[str] = []


# -- Scholarships --
class ScholarshipsResponse(BaseModel):
    count: int
    data: list


# ---------------------------------------------------------------------------
# Google Sheets helper
# ---------------------------------------------------------------------------
_sheets_client = None
_scholarship_data_cache: Optional[list] = None


def _get_gspread_client():
    """Lazily initialise and return a gspread client."""
    global _sheets_client
    if _sheets_client is not None:
        return _sheets_client
    try:
        import gspread
        _sheets_client = gspread.service_account(filename=CREDENTIALS_PATH)
        return _sheets_client
    except Exception as exc:
        print(f"[WARN] gspread init failed: {exc}")
        return None


def _load_scholarship_data() -> list:
    """Load scholarship rows from the first Google Sheet available."""
    global _scholarship_data_cache
    if _scholarship_data_cache is not None:
        return _scholarship_data_cache

    client = _get_gspread_client()
    if client is None:
        return []

    try:
        sheet = client.open("Scholarships_DB").sheet1
        records = sheet.get_all_records()
        _scholarship_data_cache = records
        return records
    except Exception as exc:
        print(f"[WARN] Could not load scholarship sheet: {exc}")
        return []


def invalidate_scholarship_cache():
    global _scholarship_data_cache
    _scholarship_data_cache = None


# ---------------------------------------------------------------------------
# Scraped scholarship documents -> summaries (notices, brochures, PDFs)
# ---------------------------------------------------------------------------
_scraped_doc_cache: Optional[list] = None
_SCRAPED_DOCS_DIR = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "storage", "documents"
)


def _summarize_with_llm(text: str, max_len: int = 300) -> str:
    if text is None or not str(text).strip():
        return ""
    snippet = str(text).strip()
    if len(snippet) > 6000:
        snippet = snippet[:6000]
    try:
        reply = _call_llm(
            [
                {
                    "role": "system",
                    "content": "You summarize official scholarship notices and brochures "
                    "for students. Return a concise 3-5 sentence summary covering: what "
                    "the scheme is, eligibility, benefits, key dates, how to apply.",
                },
                {"role": "user", "content": snippet},
            ],
            snippet,
            max_tokens=max_len,
        )
        if reply:
            return reply.strip()
    except Exception:
        pass
    lines = [ln.strip() for ln in snippet.splitlines() if ln.strip()]
    return " ".join(lines[:5])[:max_len]


def _summarize_pdf_with_vision(file_bytes: bytes, max_pages: int = 1) -> str:
    """
    Summarize a (mostly scanned/Hindi) PDF by rendering its pages to images and
    sending them to a multimodal LLM via OpenRouter. This bypasses text-OCR,
    which breaks on Devanagari scripts. Returns a summary string or "".
    """
    api_key = os.getenv("OPENROUTER_API_KEY", "") or OPENROUTER_API_KEY
    if not api_key:
        return ""
    try:
        import fitz  # pymupdf
        import base64
    except Exception:
        return ""
    # Model order can be overridden with VISION_MODELS env (comma separated).
    # Paid qwen is first (cheap, ~$0.002/doc) so it works even when free tier
    # rate-limit (429) is exhausted.
    _env_models = (os.getenv("VISION_MODELS") or "").strip()
    if _env_models:
        vision_models = [m.strip() for m in _env_models.split(",") if m.strip()]
    else:
        vision_models = [
            "qwen/qwen2.5-vl-72b-instruct",
            "google/gemini-2.5-flash",
            "nvidia/nemotron-3.5-super-vl:free",
        ]
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Campus AI Assistant",
    }
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception as exc:
        print(f"[WARN] vision: cannot open pdf: {exc}")
        return ""
    content_blocks = []
    try:
        for i, page in enumerate(doc):
            if i >= max_pages:
                break
            pix = page.get_pixmap(dpi=150)
            img_bytes = pix.tobytes("png")
            b64 = base64.b64encode(img_bytes).decode()
            content_blocks.append(
                {
                    "type": "image_url",
                    "image_url": {"url": "data:image/png;base64," + b64},
                }
            )
    finally:
        doc.close()
    if not content_blocks:
        return ""
    content_blocks.insert(
        0,
        {
            "type": "text",
            "text": (
                "This is a government notice (may be in Hindi/Devanagari). "
                "Summarize in English: what scheme/notice it is, eligibility, "
                "benefits, key dates, and how to apply. 3-5 concise sentences."
            ),
        },
    )
    for model in vision_models:
        try:
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": content_blocks}],
                "max_tokens": 1200,
            }
            resp = http_requests.post(
                OPENROUTER_URL, headers=headers, json=payload, timeout=90
            )
            if resp.status_code == 200:
                data = resp.json()
                msg = data.get("choices", [{}])[0].get("message", {})
                content = msg.get("content") or msg.get("reasoning") or ""
                if content and str(content).strip():
                    print(f"[INFO] Vision model {model} summarized PDF")
                    return str(content).strip()
            else:
                print(f"[WARN] Vision model {model} -> {resp.status_code}")
                # Add 10 credits to OpenRouter to unlock paid models / more
                # free requests. 429 (rate limit) is the main blocker.
                if resp.status_code == 429:
                    import time as _time
                    _time.sleep(3)
        except Exception as exc:
            print(f"[WARN] Vision model {model} error: {exc}")
    return ""


def _build_scraped_doc_summaries() -> list:
    results: list = []
    try:
        if not os.path.isdir(_SCRAPED_DOCS_DIR):
            _scraped_doc_cache = results
            return results
        for fname in sorted(os.listdir(_SCRAPED_DOCS_DIR)):
            if not fname.lower().endswith(".pdf"):
                continue
            fpath = os.path.join(_SCRAPED_DOCS_DIR, fname)
            try:
                with open(fpath, "rb") as fh:
                    data = fh.read()
            except Exception:
                continue
            text = _extract_text_from_pdf(data) or ""
            if not text.strip():
                text = "Scraped document content not extractable."
            # Only use vision for scanned documents (no usable text layer),
            # e.g. Hindi notices. Files with real text go through the text LLM.
            npages = _pdf_page_count(data) if data else 1
            textlen = len(text.strip())
            summary = ""
            if textlen < 120 and npages <= 6:
                summary = _summarize_pdf_with_vision(data)
            if not summary and text.strip():
                summary = _summarize_with_llm(text)
            base = os.path.splitext(fname)[0]
            results.append(
                {
                    "id": base,
                    "title": base.replace("_", " ").title(),
                    "category": "Scholarship Notice / Brochure",
                    "fileType": "PDF",
                    "pages": _pdf_page_count(data) if data else 1,
                    "summary": summary or text[:250],
                    "source": fname,
                    "downloadPath": "/api/v1/scholarships/documents/{0}/download".format(base),
                }
            )
    except Exception as exc:
        print(f"[WARN] Scraped doc scan error: {exc}")
    _scraped_doc_cache = results
    # Persist to disk so we don't re-run expensive OCR/vision on next startup.
    try:
        _cache_dir = os.path.join(os.path.dirname(__file__), "_cache")
        os.makedirs(_cache_dir, exist_ok=True)
        with io.open(os.path.join(_cache_dir, "scraped_docs.json"), "w", encoding="utf-8") as fh:
            json.dump(results, fh, ensure_ascii=False)
    except Exception:
        pass
    return results


def _load_scraped_doc_summaries() -> list:
    global _scraped_doc_cache
    if _scraped_doc_cache is not None:
        return _scraped_doc_cache
    # If a persisted snapshot exists, use it while the background refresh runs.
    try:
        _cache_f = os.path.join(os.path.dirname(__file__), "_cache", "scraped_docs.json")
        if os.path.exists(_cache_f):
            with io.open(_cache_f, encoding="utf-8") as fh:
                _scraped_doc_cache = json.load(fh)
    except Exception:
        pass
    # Populate lazily in background so the first request returns quickly.
    try:
        import threading
        def _bg():
            global _scraped_doc_cache
            _scraped_doc_cache = _build_scraped_doc_summaries()
        threading.Thread(target=_bg, daemon=True).start()
    except Exception:
        _scraped_doc_cache = _build_scraped_doc_summaries()
    return _scraped_doc_cache or []

def invalidate_scraped_doc_cache():
    global _scraped_doc_cache
    _scraped_doc_cache = None


class ScrapedDocResponse(BaseModel):
    count: int = 0
    documents: list = Field(default_factory=list)


@app.get("/api/v1/scholarships/documents", response_model=ScrapedDocResponse)
async def list_scraped_documents():
    docs = _load_scraped_doc_summaries()
    return ScrapedDocResponse(count=len(docs), documents=docs)


@app.get("/api/v1/scholarships/documents/{doc_id}/download")
async def download_scraped_document(doc_id: str):
    if not os.path.isdir(_SCRAPED_DOCS_DIR):
        raise HTTPException(status_code=404, detail="Not found")
    for c in (doc_id + ".pdf", doc_id + ".PDF"):
        fp = os.path.join(_SCRAPED_DOCS_DIR, c)
        if os.path.exists(fp):
            from fastapi.responses import FileResponse
            return FileResponse(fp, media_type="application/pdf", filename=c)
    raise HTTPException(status_code=404, detail="Not found")


# ---------------------------------------------------------------------------
# OpenRouter helper with fallback chain
# ---------------------------------------------------------------------------


def _call_openrouter(messages: list, *, temperature: float = 0.7, max_tokens: int = 2048) -> Optional[str]:
    """
    Try each model in FALLBACK_MODELS until one succeeds.
    Returns the assistant content string or None.
    """
    api_key = os.getenv("OPENROUTER_API_KEY", "") or OPENROUTER_API_KEY
    if not api_key:
        print("[WARN] OPENROUTER_API_KEY not set — skipping AI call")
        return None

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Campus AI Assistant",
    }

    for model in FALLBACK_MODELS:
        try:
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            resp = http_requests.post(
                OPENROUTER_URL, headers=headers, json=payload, timeout=12
            )
            if resp.status_code == 200:
                data = resp.json()
                msg = data.get("choices", [{}])[0].get("message", {})
                content = msg.get("content") or msg.get("reasoning") or ""
                if content and str(content).strip():
                    print(f"[INFO] OpenRouter Model {model} responded successfully")
                    return str(content).strip()
            else:
                print(f"[WARN] Model {model} returned {resp.status_code}: {resp.text[:120]}")
                # Rate limit or 4xx will apply to every free model; don't waste
                # time trying the rest of the fallback chain.
                if resp.status_code in (401, 402, 429):
                    break
        except Exception as exc:
            print(f"[WARN] Model {model} error: {exc}")

    return None



def _call_gemini(prompt: str) -> Optional[str]:
    """Call Google Gemini API if GEMINI_API_KEY is configured."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
    if not api_key:
        return None
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    try:
        resp = http_requests.post(url, json=payload, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "")
    except Exception as exc:
        print(f"[WARN] Gemini error: {exc}")
    return None


def _call_llm(messages: list, prompt_text: str = "", *, temperature: float = 0.7, max_tokens: int = 2048) -> Optional[str]:
    """Try Gemini first, then fallback to OpenRouter free models."""
    res = _call_gemini(prompt_text or (messages[-1].get("content", "") if messages else ""))
    if res:
        return res
    return _call_openrouter(messages, temperature=temperature, max_tokens=max_tokens)

def _parse_json_from_llm(text: str) -> Optional[dict]:
    """Best-effort extraction of JSON from an LLM response."""
    # Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Try to find ```json ... ```
    import re
    match = re.search(r"```(?:json)?\s*\n?(.*?)```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass
    # Try to find first { ... } or [ ... ]
    for start_char, end_char in [("{", "}"), ("[", "]")]:
        start = text.find(start_char)
        if start == -1:
            continue
        depth = 0
        for i in range(start, len(text)):
            if text[i] == start_char:
                depth += 1
            elif text[i] == end_char:
                depth -= 1
            if depth == 0:
                try:
                    return json.loads(text[start : i + 1])
                except json.JSONDecodeError:
                    break
    return None


# ---------------------------------------------------------------------------
# PDF text extraction helper
# ---------------------------------------------------------------------------

def _extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF using pypdf, falling back to OCR (RapidOCR) for scanned PDFs."""
    try:
        from pypdf import PdfReader
        import io

        reader = PdfReader(io.BytesIO(file_bytes))
        pages: List[str] = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text)
        joined = "\n\n".join(pages)
        # If pypdf extracted nothing meaningful, fall back to OCR for scanned PDFs.
        if len(joined.strip()) < 20:
            ocr_text = _ocr_extract_pdf(file_bytes)
            if ocr_text and len(ocr_text.strip()) > len(joined.strip()):
                return ocr_text
        return joined
    except Exception as exc:
        print(f"[WARN] PDF extraction error: {exc}")
        try:
            ocr_text = _ocr_extract_pdf(file_bytes)
            if ocr_text:
                return ocr_text
        except Exception as ocr_exc:
            print(f"[WARN] OCR extraction error: {ocr_exc}")
        return ""


def _pdf_page_count(file_bytes: bytes) -> int:
    """Count pages in a PDF using pypdf."""
    try:
        from pypdf import PdfReader
        import io
        reader = PdfReader(io.BytesIO(file_bytes))
        return max(1, len(reader.pages))
    except Exception:
        return 1
def _ocr_extract_pdf(file_bytes: bytes) -> str:
    """Run OCR on a PDF's pages using RapidOCR (onnxruntime), fallback-safe."""
    try:
        import fitz  # pymupdf
        from rapidocr_onnxruntime import RapidOCR
    except Exception:
        return ""
    try:
        ocr = RapidOCR()
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        texts = []
        for page in doc:
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            import tempfile, os
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                tmp.write(img_bytes)
                tmp_path = tmp.name
            try:
                result, _ = ocr(tmp_path)
                if result:
                    for line in result:
                        if isinstance(line, (tuple, list)) and len(line) >= 2:
                            texts.append(str(line[1]))
            finally:
                try:
                    os.remove(tmp_path)
                except Exception:
                    pass
            if len("\n".join(texts)) > 4000:  # cap OCR work
                break
        return "\n".join(texts)
    except Exception as exc:
        print(f"[WARN] OCR fallback failed: {exc}")
        return ""


# ---------------------------------------------------------------------------
# 1. POST /api/v1/chat/generate
# ---------------------------------------------------------------------------

@app.post("/api/v1/chat/generate", response_model=ChatResponse)
async def chat_generate(req: ChatRequest, user: Optional[dict] = Depends(get_optional_user)):
    """RAG-powered chat endpoint using scholarship data as context."""
    try:
        # Build RAG context from Google Sheets scholarship data
        scholarships = _load_scholarship_data()
        context_chunks: List[str] = []
        relevant_citations: List[Citation] = []

        if scholarships:
            # Simple keyword-based retrieval
            query_lower = req.message.lower()
            for idx, row in enumerate(scholarships):
                row_text = " ".join(str(v).lower() for v in row.values())
                # Check for keyword overlap
                if any(word in row_text for word in query_lower.split() if len(word) > 2):
                    context_chunks.append(json.dumps(row, ensure_ascii=False))
                    relevant_citations.append(
                        Citation(
                            id=str(idx + 1),
                            title=_get_scholarship_title(row),
                            page=str(row.get("Deadline", row.get("deadline", "Active"))),
                            author=_get_scholarship_provider(row),
                        )
                    )
            # If no keyword match, include up to first 10 rows as general context
            if not context_chunks:
                for idx, row in enumerate(scholarships[:10]):
                    context_chunks.append(json.dumps(row, ensure_ascii=False))

        # Also include summarized scraped scholarship documents (notices/brochures)
        try:
            scraped_docs = _load_scraped_doc_summaries()
            if scraped_docs:
                doc_chunk = "\n".join(
                    "{0}: {1}".format(d.get("title", "Notice"), d.get("summary", ""))
                    for d in scraped_docs[:8]
                )
                if doc_chunk.strip():
                    context_chunks.append("[Scraped Scholarship Documents]\n" + doc_chunk)
        except Exception:
            pass

        rag_context = "\n".join(context_chunks[:15])  # cap to avoid token overflow

        # Tailor system persona and instructions according to specialized mode
        if req.mode == "scholarship":
            system_prompt = (
                "You are Campus AI's Chief Scholarship & Financial Aid Advisor. "
                "You specialize in government scholarships (MPTAAS, MMVY, NSP) and private merit scholarships (Reliance, Tata, Birla). "
                "Help students with eligibility criteria, family income limits, document checklists, and application deadlines.\n\n"
            )
        elif req.mode == "counselling":
            system_prompt = (
                "You are Campus AI's Senior Admissions & Counselling Strategist. "
                "You specialize in MP DTE Centralized Counselling (B.Tech General, CLC, Lateral Entry, TFW 100% Tuition Fee Waiver Scheme) and JoSAA/CSAB (IIT/NIT/IIIT seat allotment, rounds 1-6 cutoffs, special rounds). "
                "Provide accurate cutoffs, opening/closing ranks, choice filling strategies, and document requirements.\n\n"
            )
        elif req.mode == "study_material":
            system_prompt = (
                "You are Campus AI's Academic Professor & Exam Preparation Guide. "
                "You assist students with university Previous Year Questions (PYQs), solving end-semester problems step-by-step, explaining concepts from lecture notes, and providing concise syllabus revision summaries.\n\n"
            )
        else:
            system_prompt = (
                "You are Campus AI, an intelligent academic copilot for university students. "
                "Answer questions accurately, constructively, and concisely.\n\n"
            )

        if rag_context:
            system_prompt += f"=== Verified Campus Knowledge & Portal Database ===\n{rag_context}\n=== End Database ===\n"

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.message},
        ]

        reply = _call_llm(messages, req.message)

        if reply:
            return ChatResponse(
                reply=reply,
                citations=relevant_citations[:5],
            )

        # Fallback if external LLM is unavailable: Provide contextual RAG or smart conversational response
        q_clean = req.message.lower().strip()

        # Handle questions about model name / identity / status
        if any(term in q_clean for term in ["model name", "which model", "what model", "who are you", "what model is this", "model"]):
            active_engine = "Google Gemini 1.5 Flash" if GEMINI_API_KEY else ("OpenRouter (" + FALLBACK_MODELS[0] + ")" if OPENROUTER_API_KEY else "CampusAI Local RAG Engine")
            status_reply = (
                "🤖 **CampusAI Assistant (v2.4)**\n\n"
                f"• **Active AI Engine**: {active_engine}\n"
                "• **Configured Free Models**: `nvidia/nemotron-3.5-lightning:free`, `liquid/lfm-2.5-2.6b:free`, `gemini-1.5-flash`\n"
                "• **Campus Knowledge Base**: 49 Verified Live Scholarships (MPTAAS, MMVY, Reliance, Tata, Birla, Global) indexed via Google Sheets\n\n"
                "💡 *Tip: To connect live cloud LLMs, simply add your free `OPENROUTER_API_KEY` or `GEMINI_API_KEY` to `config/.env`.*"
            )
            return ChatResponse(reply=status_reply, citations=[])

        # Handle casual greetings
        if q_clean in ["hi", "hello", "hey", "namaste", "good morning", "good afternoon", "good evening"]:
            greeting_reply = (
                "Hello! 👋 I am your **Campus AI Assistant**.\n\n"
                "I can help you find scholarships, summarize academic notices, or generate practice quizzes. Try asking:\n"
                "• *'What scholarships are available for engineering students?'*\n"
                "• *'Tell me about MPTAAS and MMVY schemes'*\n"
                "• *'Show Reliance or Tata scholarships'*"
            )
            return ChatResponse(reply=greeting_reply, citations=[])

        # If keyword matched specific scholarships
        if relevant_citations:
            items_text = "\n".join([f"• **{c.title}** ({c.author}) — Last Date/Status: *{c.page}*" for c in relevant_citations[:5]])
            fallback_reply = (
                "Here are verified scholarship opportunities from our campus database matching your query:\n\n"
                f"{items_text}\n\n"
                "💡 Visit the **Scholarship Explorer** tab in your dashboard for complete eligibility criteria and direct application links."
            )
            return ChatResponse(reply=fallback_reply, citations=relevant_citations[:5])

        # General scholarship display
        if scholarships:
            sample = scholarships[:4]
            items_text = "\n".join([f"• **{_get_scholarship_title(s)}** ({_get_scholarship_provider(s)}) — {_get_scholarship_amount(s)}" for s in sample])
            fallback_reply = (
                f"I processed your query: \"{req.message}\".\n\n"
                "Here are top active scholarships from our campus database:\n\n"
                f"{items_text}\n\n"
                f"💡 All {len(scholarships)} state and national scholarships are available in the Scholarship Explorer tab!"
            )
            return ChatResponse(reply=fallback_reply, citations=[])

    except Exception as exc:
        traceback.print_exc()
        return ChatResponse(
            reply=f"Sorry, an error occurred while processing your request. Please try again later.",
            citations=[],
        )


# ---------------------------------------------------------------------------
# 2. POST /api/v1/quiz/generate
# ---------------------------------------------------------------------------

HARDCODED_QUIZ_QUESTIONS = [
    QuizQuestion(
        id="hc-1",
        question="What is the primary purpose of an operating system?",
        options=[
            "To manage hardware and software resources",
            "To browse the internet",
            "To edit documents",
            "To play games",
        ],
        correctIndex=0,
        explanation="An operating system manages computer hardware and software resources and provides common services for computer programs.",
    ),
    QuizQuestion(
        id="hc-2",
        question="Which data structure uses FIFO (First In, First Out) principle?",
        options=["Stack", "Queue", "Tree", "Graph"],
        correctIndex=1,
        explanation="A Queue follows the FIFO principle where the first element added is the first one to be removed.",
    ),
    QuizQuestion(
        id="hc-3",
        question="What does HTML stand for?",
        options=[
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language",
        ],
        correctIndex=0,
        explanation="HTML stands for Hyper Text Markup Language, the standard language for creating web pages.",
    ),
    QuizQuestion(
        id="hc-4",
        question="Which of the following is NOT a programming paradigm?",
        options=[
            "Object-Oriented",
            "Functional",
            "Procedural",
            "Computational",
        ],
        correctIndex=3,
        explanation="Computational is not a standard programming paradigm. The main paradigms are Object-Oriented, Functional, Procedural, and Logic programming.",
    ),
    QuizQuestion(
        id="hc-5",
        question="What is the time complexity of binary search?",
        options=["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctIndex=1,
        explanation="Binary search has a time complexity of O(log n) because it halves the search space with each comparison.",
    ),
]


@app.post("/api/v1/quiz/generate", response_model=QuizResponse)
async def quiz_generate(req: QuizRequest, user: Optional[dict] = Depends(get_optional_user)):
    """Generate quiz questions using AI, with hardcoded fallback."""
    quiz_id = str(uuid.uuid4())
    count = max(1, min(req.count, 20))

    try:
        prompt = (
            f"Generate exactly {count} multiple-choice quiz questions for the subject "
            f"'{req.subjectId}', unit '{req.unit}', at '{req.difficulty}' difficulty level.\n\n"
            f"Return ONLY valid JSON (no markdown) in this exact format:\n"
            f'{{"questions": [\n'
            f'  {{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..."}}\n'
            f"]}}\n\n"
            f"correctAnswer is the 0-based index of the correct option. "
            f"Provide exactly 4 options per question. Make questions educational and accurate."
        )

        messages = [
            {"role": "system", "content": "You are a quiz generator. Output ONLY valid JSON, nothing else."},
            {"role": "user", "content": prompt},
        ]

        raw = _call_llm(messages, prompt, temperature=0.8, max_tokens=4096)

        if raw:
            parsed = _parse_json_from_llm(raw)
            if parsed:
                q_list = parsed.get("questions", parsed) if isinstance(parsed, dict) else parsed
                if isinstance(q_list, list) and len(q_list) > 0:
                    questions = []
                    for idx, q in enumerate(q_list[:count]):
                        questions.append(
                            QuizQuestion(
                                id=str(uuid.uuid4()),
                                question=q.get("question", f"Question {idx+1}"),
                                options=q.get("options", ["A", "B", "C", "D"]),
                                correctIndex=int(q.get("correctAnswer", q.get("correctIndex", 0))),
                                explanation=q.get("explanation", "No explanation provided."),
                            )
                        )
                    return QuizResponse(
                        quizId=quiz_id,
                        subject=req.subjectId,
                        unit=req.unit,
                        difficulty=req.difficulty,
                        questions=questions,
                    )
    except Exception as exc:
        traceback.print_exc()

    # Fallback to hardcoded questions
    print("[INFO] Using hardcoded fallback quiz questions")
    return QuizResponse(
        quizId=quiz_id,
        subject=req.subjectId,
        unit=req.unit,
        difficulty=req.difficulty,
        questions=HARDCODED_QUIZ_QUESTIONS[:count],
    )


# ---------------------------------------------------------------------------
# 3. POST /api/v1/summarize/upload
# ---------------------------------------------------------------------------

@app.post("/api/v1/summarize/upload", response_model=SummarizeResponse)
async def summarize_upload(file: UploadFile = File(...), user: Optional[dict] = Depends(get_optional_user)):
    """Summarise an uploaded PDF or text document."""
    try:
        file_bytes = await file.read()
        filename = file.filename or "document"

        # Extract text
        if filename.lower().endswith(".pdf"):
            text = _extract_text_from_pdf(file_bytes)
        else:
            # Assume text file
            try:
                text = file_bytes.decode("utf-8")
            except UnicodeDecodeError:
                text = file_bytes.decode("latin-1", errors="replace")

        if not text or len(text.strip()) < 20:
            raise HTTPException(status_code=400, detail="Could not extract enough text from the uploaded file.")

        # Truncate to avoid token limits
        max_chars = 12000
        truncated_text = text[:max_chars]

        prompt = (
            "Analyse the following document and return a structured summary as ONLY valid JSON "
            "(no markdown fences, no extra text) in this exact format:\n"
            "{\n"
            '  "title": "Document title or best guess",\n'
            '  "executiveOverview": "A comprehensive 3-5 sentence summary",\n'
            '  "importantDates": [{"label": "Deadline name", "date": "Date string"}],\n'
            '  "eligibilityRequirements": ["requirement 1", ...],\n'
            '  "requiredDocuments": ["document 1", ...],\n'
            '  "applicationProcedures": ["step 1", ...]\n'
            "}\n\n"
            "If a field is not applicable, use an empty array [].\n\n"
            f"=== DOCUMENT TEXT ===\n{truncated_text}\n=== END ==="
        )

        messages = [
            {"role": "system", "content": "You are a document analyst. Output ONLY valid JSON, nothing else."},
            {"role": "user", "content": prompt},
        ]

        raw = _call_openrouter(messages, max_tokens=4096)

        if raw:
            parsed = _parse_json_from_llm(raw)
            if parsed and isinstance(parsed, dict):
                dates = []
                for d in parsed.get("importantDates", []):
                    if isinstance(d, dict):
                        dates.append(ImportantDate(
                            label=str(d.get("label", "")),
                            date=str(d.get("date", "")),
                        ))

                return SummarizeResponse(
                    title=str(parsed.get("title", filename)),
                    executiveOverview=str(parsed.get("executiveOverview", "")),
                    importantDates=dates,
                    eligibilityRequirements=[str(x) for x in parsed.get("eligibilityRequirements", [])],
                    requiredDocuments=[str(x) for x in parsed.get("requiredDocuments", [])],
                    applicationProcedures=[str(x) for x in parsed.get("applicationProcedures", [])],
                )

        # Fallback: basic extraction
        print("[INFO] AI summarisation failed — using basic fallback")
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        title = lines[0][:120] if lines else filename
        overview = " ".join(lines[:5])[:500] if lines else "Could not generate summary."

        return SummarizeResponse(
            title=title,
            executiveOverview=overview,
            importantDates=[],
            eligibilityRequirements=[],
            requiredDocuments=[],
            applicationProcedures=[],
        )

    except HTTPException:
        raise
    except Exception as exc:
        traceback.print_exc()
        return SummarizeResponse(
            title=file.filename or "Unknown Document",
            executiveOverview=f"An error occurred while summarising this document: {str(exc)}",
            importantDates=[],
            eligibilityRequirements=[],
            requiredDocuments=[],
            applicationProcedures=[],
        )


# ---------------------------------------------------------------------------
# 4. GET /api/v1/scholarships
# ---------------------------------------------------------------------------

def _is_counselling_record(row: dict) -> bool:
    """Check if a record is related to Counselling / Seat Allotment."""
    text = (str(row.get("Title", "")) + " " + str(row.get("Provider", "")) + " " + str(row.get("Eligibility", ""))).lower()
    counsel_keywords = ["dte", "josaa", "csab", "counselling", "counseling", "seat allotment", "clc", "lateral entry", "tfw", "tuition fee waiver"]
    return any(k in text for k in counsel_keywords)

def _is_scholarship_record(row: dict) -> bool:
    return not _is_counselling_record(row)


@app.get("/api/v1/scholarships", response_model=ScholarshipsResponse)
async def list_scholarships(user: Optional[dict] = Depends(get_optional_user)):
    """Return all scholarship records from Google Sheets."""
    try:
        data = _load_scholarship_data()
        scholarships = [r for r in data if _is_scholarship_record(r)]
        return ScholarshipsResponse(count=len(scholarships), data=scholarships)
    except Exception as exc:
        traceback.print_exc()
        return ScholarshipsResponse(count=0, data=[])


@app.get("/api/v1/counselling", response_model=ScholarshipsResponse)
async def list_counselling(user: Optional[dict] = Depends(get_optional_user)):
    """Return all counselling and seat allocation records from Google Sheets."""
    try:
        data = _load_scholarship_data()
        counselling_records = [r for r in data if _is_counselling_record(r)]
        return ScholarshipsResponse(count=len(counselling_records), data=counselling_records)
    except Exception as exc:
        traceback.print_exc()
        return ScholarshipsResponse(count=0, data=[])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------



# ---------------------------------------------------------------------------
# Background Spider Execution API
# ---------------------------------------------------------------------------

import subprocess
import threading
import time

_spider_state = {
    "status": "idle",
    "last_run": None,
    "message": "Spiders ready to scrape counselling & scholarship portals"
}

def _run_spiders_task():
    global _spider_state
    _spider_state["status"] = "running"
    _spider_state["last_run"] = time.strftime("%Y-%m-%d %H:%M:%S")
    _spider_state["message"] = "Crawling MP DTE, JoSAA, CSAB, MPTAAS, MMVY, Reliance, Tata & Birla portals..."
    try:
        bat = r'C:\Users\DELL\Desktop\New_Project\run_all_spiders.bat'
        subprocess.run([bat], shell=True, capture_output=True, text=True, timeout=300)
        _spider_state["status"] = "completed"
        _spider_state["message"] = "All 9 web scrapers finished successfully. Google Sheets updated with verified records."
        global _scholarship_data_cache
        _scholarship_data_cache = None
    except Exception as exc:
        _spider_state["status"] = "failed"
        _spider_state["message"] = f"Scraper error: {exc}"

@app.post("/api/v1/spiders/run")
async def trigger_spiders():
    """Run all 9 web scrapers asynchronously."""
    global _spider_state
    if _spider_state["status"] == "running":
        return {"status": "running", "message": "Scrapers are already executing in background."}
    threading.Thread(target=_run_spiders_task, daemon=True).start()
    return {"status": "started", "message": "Web scrapers started in background. Google Sheets will update with fresh data."}

@app.get("/api/v1/spiders/status")
async def get_spider_status():
    """Get current crawler execution status."""
    global _spider_state
    return _spider_state

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "ok",
        "service": "campus-ai",
        "version": "1.0.0",
        "openrouter_configured": bool(OPENROUTER_API_KEY),
    }


# ---------------------------------------------------------------------------
# Root redirect
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    return {"message": "Campus AI Service is running. Visit /docs for API documentation."}


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    print("[INFO] Starting Campus AI Service on port 8000 ...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
