# 🏛️ Architecture & Data Flow

This document describes the system architecture, the microservices, and how data flows end-to-end.

---

## 1. High-level diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                         React Frontend  (Vite, :5173)                    │
│  AuthContext · BookmarkContext · ThemeContext                             │
│  Pages: Landing, Login/Register, Dashboard, Scholarships, Counselling,    │
│         Resources(Study Material), Summarizer, Planner, Quiz, Chat,       │
│         Admin, SavedResources, OAuthCallback                              │
└───────┬──────────────────────────────────────────────┬───────────────────┘
        │ REST :5000/api (Spring Boot)                 │ REST :8000/api/v1 (FastAPI)
        ▼                                              ▼
┌─────────────────────────────┐          ┌─────────────────────────────────────┐
│  Spring Boot Backend        │          │  FastAPI Gen AI / RAG               │
│  · JPA/H2 (campusaidb)      │          │  · /scholarships/documents          │
│  · JWT auth, OAuth2 google  │◀───────▶│  · /documents/{id}/summary (aiSummary)│
│  · /resources upload/serve  │          │  · /documents/{id}/preview,download  │
│  · /admin ops               │          │  · /spiders/run, /spiders/status    │
│  · services → Google Drive  │          │  · RAG retrieval over scraped docs   │
└──────────────┬──────────────┘          │  · Multi-provider LLM (Groq/Gemini/  │
               │                         │    OpenRouter) + cooldown/retry      │
               │                         │  · PDF text extraction + OCR (Tesser-│
               ▼                         │    act/EasyOCR), structured aiSummary │
        ┌────────────┐                   └───────────────┬─────────────────────┘
        │ Google Drive │                                   │
        │ (docs storage)│                                   ▼
        └────────────┘                    ┌──────────────────────────────┐
                                          │  Shared data / cache         │
                                          │  · _cache/scraped_docs.json  │
                                          │  · _cache/structured_summar- │
                                          │    ies.json                  │
                                          │  · webscraping-service JSON   │
                                          │  · Google Sheets (DB)        │
                                          └──────────────────────────────┘
```

---

## 2. Microservices

### 2.1 Spring Boot (`spring-boot-service/`)
- **Java/Spring Boot** with JPA + H2 in-memory DB (`jdbc:h2:mem:campusaidb`).
- Handles **auth** (register/login, JWT), **Google OAuth2 SSO**, **resource uploads**, **admin verification workflow**.
- **docs-service** (`drive_manager.py`) wraps Google Drive via service-account credentials: `list_folder_documents(category)` reads folder IDs for PYQ/Notices/Notes/Brochures.
- Port: `5000`.

### 2.2 FastAPI Gen AI / RAG (`gen-ai-and-rag-service/`)
- **main.py** — all AI endpoints + startup cache warm-up (`_warm_scraped_doc_cache`).
- **RAG / chat** — lexical/keyword weighted scoring over the scraped knowledge base; offline/contextual fallback.
- **Multi-provider LLM** — `_call_llm()` rotates Groq → Gemini → OpenRouter, honoring per-provider rate-limit cooldowns and per-provider retry/backoff.
- **PDF summarization** — direct text extraction + OCR (Tesseract/EasyOCR) for scanned/Hindi PDFs → extractive + LLM summary.
- **Structured `aiSummary`** — `/documents/{id}/summary` uses the LLM to extract JSON: `eligibility`, `incomeCap`, `financialBenefits`, `deadlines`, `keyTakeaways[]`, `requiredDocuments[]`. Cached in `_cache/structured_summaries.json`.
- Port: `8000`.

### 2.3 Web scraping engine (`webscraping-service/`)
- **Scrapy** project; `scholarship_spider.py` orchestrates multiple spiders.
- **Spiders** (in `spiders/`): `mptaas`, `mmvy`, `reliance`, `tata`, `birla`, `national`, `mp_dte_counselling`, `josaa_counselling`, `campus_docs`, plus shared `_base.py`.
- **pipelines.py** — `GoogleSheetPipeline` writes items to Google Sheets (with fallback to local JSON if credentials unavailable).
- Additional one-off scrapers: `scrape_mptaas_pdfs.py`, `scrape_mmvy_pdfs.py`, `mptaas_pdf_scraper.py`.

### 2.4 Frontend (`Frontend/`)
- React 18 + Vite 5 + Tailwind + react-router-dom + framer-motion + recharts + lucide-react.
- **services/** map to REST endpoints; `api.js` centralises axios clients (`apiClient` for :5000, `aiClient` for :8000) with mock fallback on unreachable backends.
- **context/** = `AuthContext`, `BookmarkContext`, `ThemeContext`.

---

## 3. Data flow — scraped document → structured summary

1. **Scrapy** engineers crawl scholarship/counselling sites and pop a PDF.
2. `campus_docs_spider.py` (or the PDF scrapers) saves PDFs to the scraped-docs dir and syncs metadata to a backend/Google Sheets.
3. On startup, FastAPI `_warm_scraped_doc_cache()` scans the folder and writes `_cache/scraped_docs.json` (each doc: `id`, `title`, `category`, `fileType`, `pages`, `summary`, `summarySource`, `source`, `downloadPath`).
4. Frontend lists documents via `GET /documents`.
5. On opening a notice, frontend calls `GET /documents/{id}/summary`:
   - backend finds the doc, extracts its plain `summary` text,
   - LLM extracts structured JSON fields,
   - result cached (per `doc_id`) in `structured_summaries.json`,
   - response includes `{ markdown, summarySource, aiSummary }`.
6. Frontend renders the four "benchmark" boxes from `aiSummary.*`; if a field is missing, the LLM returns "Not specified in notice" (real, not a placeholder).

---

## 4. Google integration

| Concern | Mechanism |
|---|---|
| SSO | Spring Security OAuth2 client, Google web client id/secret |
| Storage | Service account `config/credentials.json`; folder IDs in `drive_manager.py` |
| Sheets sync | `gspread` in the scraping pipeline (fallback to JSON) |

---

## 5. Key runtime properties
- `FRONTEND_URL=http://localhost:5173`
- Spring redirect: `http://localhost:5000/login/oauth2/code/google`
- FastAPI routes exposed under `/api/v1`.
