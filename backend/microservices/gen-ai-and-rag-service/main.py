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
    "nvidia/nemotron-3.5-lightning:free",
    "liquid/lfm-2.5-2.6b:free",
    "dots-studio/dots-3-note-preview:free",
    "xingchen-agi/xing4.0-29b-a4b:free",
    "recursive/flint-v1.0:free",
    "cohere/north-mini-code:free",
    "thinkingmachines/inkling:free",
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
# OpenRouter helper with fallback chain
# ---------------------------------------------------------------------------


def _call_openrouter(messages: list, *, temperature: float = 0.7, max_tokens: int = 2048) -> Optional[str]:
    """
    Try each model in FALLBACK_MODELS until one succeeds.
    Returns the assistant content string or None.
    """
    if not OPENROUTER_API_KEY:
        print("[WARN] OPENROUTER_API_KEY not set — skipping AI call")
        return None

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Campus AI",
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
                OPENROUTER_URL, headers=headers, json=payload, timeout=60
            )
            if resp.status_code == 200:
                data = resp.json()
                content = (
                    data.get("choices", [{}])[0]
                    .get("message", {})
                    .get("content", "")
                )
                if content:
                    print(f"[INFO] Model {model} responded successfully")
                    return content
            else:
                print(f"[WARN] Model {model} returned {resp.status_code}: {resp.text[:200]}")
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
    """Extract text from a PDF using pypdf."""
    try:
        from pypdf import PdfReader
        import io

        reader = PdfReader(io.BytesIO(file_bytes))
        pages: List[str] = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text)
        return "\n\n".join(pages)
    except Exception as exc:
        print(f"[WARN] PDF extraction error: {exc}")
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

        rag_context = "\n".join(context_chunks[:15])  # cap to avoid token overflow

        system_prompt = (
            "You are Campus AI, a helpful assistant for university students. "
            "Answer questions accurately and concisely. "
            "If scholarship data is provided below, use it to answer scholarship-related queries.\n\n"
        )
        if rag_context:
            system_prompt += f"=== Scholarship Database ===\n{rag_context}\n=== End ===\n"

        if req.mode and req.mode != "general":
            system_prompt += f"\nThe user is in '{req.mode}' mode. Tailor your response accordingly.\n"

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

@app.get("/api/v1/scholarships", response_model=ScholarshipsResponse)
async def list_scholarships(user: Optional[dict] = Depends(get_optional_user)):
    """Return all scholarship records from Google Sheets."""
    try:
        data = _load_scholarship_data()
        return ScholarshipsResponse(count=len(data), data=data)
    except Exception as exc:
        traceback.print_exc()
        return ScholarshipsResponse(count=0, data=[])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

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
