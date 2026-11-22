# AI-Powered Campus Information Hub 🎓🚀

A **production-grade enterprise microservices platform** for university students, faculty, and administrators. It combines:

- **Spring Boot** enterprise backend (auth, JWT, resources, admin)
- **FastAPI Generative AI / RAG** service with multiple LLM providers
- **Multi-Spider Web Scraping Engine** (Scrapy) for scholarships, counselling rulebooks & campus documents
- **Google Cloud Suite** (Drive storage + Sheets sync)
- **React + Vite + Tailwind** frontend with dark/light theme

---

## ✨ Features

| Area | Highlights |
|---|---|
| 🎓 **Scholarships Hub** | 9 live scrapers (MPTAAS, MMVY, Reliance, Tata, Birla, National/NSP, MP-DTE, JoSAA, Campus Docs). AI eligibility/income/benefits/timeline extraction. |
| 🧠 **AI Chat & Gen AI** | RAG over scraped knowledge base, provider rotation (Groq / Gemini / OpenRouter), offline fallback. |
| 🤖 **AI Document Summarizer** | PDF → text → extractive + LLM summary; OCR (Tesseract/EasyOCR) for Hindi/Devanagari scanned docs; structured `aiSummary` boxes. |
| 📄 **Resource Finder / Study Material** | PYQs, Notices, Notes, Brochures — stored & served via Google Drive. |
| 📅 **Study Planner & Quiz** | Personalized planner, question generator, quizzes. |
| 👑 **Admin Portal** | Analytics, document verification workflow, user management. |
| 🔐 **Auth** | JWT + Google OAuth2 (SSO) via Spring Security. |
| ☁️ **Google Drive/Sheets** | Service-account upload/indexing; fallback to local storage + JSON. |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite :5173)                      │
│   Login/OAuth · Dashboard · Scholarships · Counselling · Resources   │
│   Summarizer · Planner · Quiz · Chat · Admin · SavedResources        │
└───────────────┬──────────────────────────────┬──────────────────────┘
                │ http://localhost:5000/api     │ http://localhost:8000/api/v1
                ▼                              ▼
┌──────────────────────────┐   ┌───────────────────────────────────────┐
│  Spring Boot Backend      │   │  FastAPI Gen AI / RAG (Python)        │
│  (JPA/H2 · JWT · OAuth2) │   │  · RAG over scraped docs              │
│  /auth /resources /admin  │──▶│  · Multi-provider LLM (Groq/Gemini/  │
│  · Drive service account  │   │    OpenRouter) with cooldown/retry    │
└──────────────┬───────────┘   │  · PDF extraction + OCR (Tesseract/    │
               │               │    EasyOCR) · structured aiSummary     │
               │               │  · /spiders/run · /health              │
               │               └───────────────┬───────────────────────┘
               ▼                               ▼
        ┌────────────┐                ┌───────────────────┐
        │ Google Drive │                │ Google Sheets (DB) │
        │ + H2 memory │                │ + local JSON cache  │
        └────────────┘                └───────────────────┘
```

**Scraping engine (Scrapy)** runs independently and writes to Google Sheets + local JSON; FastAPI reads that cache to serve documents/summaries.

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+** (project tested on 3.14) + a virtualenv (e.g. `python -m venv venv` in the project root)
- **Node.js 18+** & npm
- **Java 17+** & Maven (for Spring Boot)
- Google service account + OAuth client (see `config/.env.example`)

### 1-Click Launch (recommended)
Double-click **`run_full_project.bat`** — starts all three services and opens the browser:
- Spring Boot → `http://localhost:5000`
- FastAPI Gen AI → `http://localhost:8000`
- React Frontend → `http://localhost:5173`

### Manual start
```bash
# 1) Backend (Spring Boot) — MUST load config/.env
backend/microservices/spring-boot-service/start_spring_boot.bat

# 2) FastAPI Gen AI
cd backend/microservices/gen-ai-and-rag-service
python -m uvicorn main:app --host 127.0.0.1 --port 8000

# 3) Frontend
cd Frontend && npm install && npm run dev
```

### Run all scrapers
Double-click **`run_all_spiders.bat`** (uses the venv scrapy).

---

## 🔌 Main API Endpoints

### FastAPI (Gen AI / RAG)
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/scholarships/documents` | List scraped documents (with track) |
| GET | `/api/v1/scholarships/documents/{id}/summary` | **Structured `aiSummary`** (eligibility, incomeCap, benefits, deadlines, keyTakeaways, requiredDocuments) |
| GET | `/api/v1/scholarships/documents/{id}/preview` | PDF preview |
| GET | `/api/v1/scholarships/documents/{id}/download` | Download PDF |
| POST | `/api/v1/spiders/run` | Trigger spiders |
| GET | `/api/v1/spiders/status` | Spider run status |

### Spring Boot (REST)
`/auth/*` (login, register, OAuth2 callback) · `/resources/*` (docs upload/serve) · `/admin/*` (admin ops).

---

## � Structure (key folders)

```
backend/microservices/
├── spring-boot-service/        # Java backend (pom.xml, start_spring_boot.bat)
├── gen-ai-and-rag-service/     # FastAPI (main.py, auth.py, _enrich_worker.py)
├── docs-service/               # Google Drive manager (drive_manager.py)
└── webscraping-service/        # Scrapy engine
    ├── scholarship_spider.py
    ├── pipelines.py            # Google Sheet / JSON pipeline
    └── spiders/                # mptaas, mmvy, reliance, tata, birla,
                                # national, mp_dte, josaa, campus_docs, _base

Frontend/src/
├── pages/                      # Landing, Login, Dashboard, Scholarships, Counselling,
│                               # Resources, Summarizer, Planner, Quiz, Chat, Admin...
├── services/                   # api, auth, admin, resource, summarizer, chat, planner, quiz
├── context/                    # Auth, Bookmark, Theme
├── components/                 # layout + common UI
└── data/mockData.js            # fallback demo data
```

---

## 🛠️ Built with Codvian — Mercury 3

This project was developed with **Codvian** (the AI coding agent from Inception) running on the **Mercury 3** model. Codvian helped build and debug the microservices, the web scraping engine, AI/OCR summarization (including Hindi/Devanagari vision summaries), the structured `aiSummary` endpoint, and Google Drive/Sheets integrations.

---

## 📄 License
Academic/enterprise project. See repository owner for usage terms.
