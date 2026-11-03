# AI-Powered Campus Information Hub 🎓🚀

A state-of-the-art enterprise microservices platform for university students, faculty, and administrators. Combines **Spring Boot Enterprise Backend** with **FastAPI Generative AI / RAG**, **Multi-Spider Web Scraping Engine**, and **Google Cloud Suite (Drive & Sheets)**.

---

## 🏛️ Project Architecture

```
AI-Powered-Campus-Information-Hub/
│
├── Frontend/                                       # 🌐 React 18 + Tailwind CSS UI (Port 5173 / 8081)
│   ├── src/pages/                                  # Chat, Resources, Admin, Summarizer, Quiz, Planner, Auth
│   └── src/services/                               # apiClient (5000), aiClient (8000), resourceService, adminService
│
├── backend/
│   └── microservices/
│       │
│       ├── spring-boot-service/                    # ☕ Core Academic, Auth & Storage Microservice (Port 5000)
│       │   ├── src/main/java/com/campusai/
│       │   │   ├── config/                         # SecurityConfig, JwtAuthFilter, OAuth2 Handlers
│       │   │   ├── controller/                     # Auth, Resources (Upload/Download), Admin, Health
│       │   │   ├── dto/                            # Login, Register, AuthResponse DTOs
│       │   │   ├── model/                          # User and Resource JPA Entities
│       │   │   ├── repository/                     # Spring Data JPA Repositories
│       │   │   └── service/                        # JwtService, GoogleOAuth2Service
│       │   ├── src/main/resources/
│       │   │   ├── application.properties          # Port 5000, H2 in-memory DB, JPA config
│       │   │   └── data.sql                        # Seed users (student, faculty, admin) & academic resources
│       │   ├── target/campus-ai-backend-1.0.0.jar  # Production executable JAR
│       │   └── pom.xml
│       │
│       ├── gen-ai-and-rag-service/                 # 🤖 Gen AI, RAG & LLM Microservice (Port 8000)
│       │   ├── main.py                             # FastAPI server (RAG Chatbot, Quiz, Summarizer)
│       │   ├── auth.py                             # Shared HMAC-SHA256 JWT validator
│       │   └── requirements.txt
│       │
│       └── webscraping-service/                    # 🕷️ Multi-Spider Web Scraping Suite
│           ├── spiders/
│           │   ├── mptaas_spider.py                # MP State Post-Matric Scholarship
│           │   ├── mmvy_spider.py                  # Medhavi Chhatra Yojana
│           │   ├── reliance_spider.py              # Reliance Foundation UG & PG (STEM/AI)
│           │   ├── tata_spider.py                  # Tata Trust Scholarship
│           │   ├── birla_spider.py                 # Aditya Birla Capital Scholarship
│           │   ├── national_spider.py              # National Merit & Central Schemes
│           │   └── campus_docs_spider.py           # Campus PYQs, Notices, Notes & Brochures
│           ├── pipelines.py                        # Google Sheets live pipeline
│           └── requirements.txt
│
├── config/
│   ├── credentials.json                            # 🔐 Google Service Account key (Git-ignored)
│   ├── .env.example                                # Template for API keys
│   └── .env                                        # Local secrets (Git-ignored)
│
├── run_full_project.bat                            # 🚀 1-Click Launcher (Spring Boot + FastAPI + Frontend)
├── run_all_backends.bat                            # 🚀 1-Click Launcher for Backends
├── run_all_spiders.bat                             # 🕷️ 1-Click Multi-Spider Crawler Runner
└── .gitignore                                      # Safe git configuration
```

---

## 🔒 Confidential Data vs. Public Drive Storage Architecture

1. **Confidential Relational Database (Spring Boot JPA / H2):**
   - User profiles, emails, student IDs, departments.
   - Cryptographically hashed passwords (BCrypt).
   - JWT tokens, OAuth 2.0 credentials, and admin logs.
   - Document upload metadata (uploader identity, review status, timestamps).
2. **Google Drive Cloud Storage Backend:**
   - Physical academic files (PYQs, Notices, Lecture Notes, Brochures) are organized into dedicated Google Drive folders.
   - Students **view and download documents directly on the website** without external redirects.
3. **Admin Verification & Review Workflow:**
   - Any document uploaded by a user is assigned **`Pending Verification`** status.
   - Administrators review the queue in the **Admin Portal** (`/admin`) and approve documents with 1 click.
   - Once approved, the document is published across the campus portal.

---

## 🔌 Microservices API Endpoints

### 1. Spring Boot Core Service (`http://localhost:5000`)
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Core service health status |
| `POST` | `/api/auth/login` | JWT Authentication (Student / Faculty / Admin) |
| `POST` | `/api/auth/register` | New student/faculty account onboarding |
| `POST` | `/api/auth/oauth2/google` | Google OAuth 2.0 Single Sign-On |
| `GET` | `/api/resources/search` | Search academic study materials with filters |
| `GET` | `/api/resources/top` | Top-downloaded academic resources |
| `GET` | `/api/resources/{id}/download` | Direct on-site document download |
| `POST` | `/api/resources/upload` | Upload study materials into review queue |
| `GET` | `/api/resources/drive-folders` | Google Drive folder references |
| `GET` | `/api/admin/stats` | Real-time analytics, query trends & documents queue |
| `POST` | `/api/admin/documents/{id}/approve` | Admin 1-click document approval |
| `DELETE` | `/api/admin/documents/{id}` | Admin document removal |

**Demo Accounts (`password123` for all):**
- **Student:** `alex.vance@campus.edu`
- **Faculty:** `e.reed@campus.edu`
- **Admin:** `m.brody@campus.admin`

---

### 2. FastAPI Gen AI & RAG Service (`http://localhost:8000`)
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/health` | Health & AI Model Status |
| `GET` | `/api/v1/scholarships` | Fetch live scholarships from Google Sheets (49+ records) |
| `POST` | `/api/v1/chat/generate` | Conversational RAG with active free LLMs & citations |
| `POST` | `/api/v1/quiz/generate` | AI MCQ Generator across academic subjects & units |
| `POST` | `/api/v1/summarize/upload` | PDF & Document Summarizer Engine |

**Active OpenRouter Free Model Chain:**
- `dots-studio/dots-3-note-preview:free` (Primary fast conversational model)
- `cohere/north-mini-code:free` (Technical code & algorithmic solver)
- `nvidia/nemotron-3.5-lightning:free` (Advanced reasoning)
- Contextual offline fallback over scraped scholarship knowledge base

---

## 🚀 How to Run Everything

### 1-Click Launch (Recommended)
Double-click **`run_full_project.bat`** in the project root:
- Starts Spring Boot on `http://localhost:5000`
- Starts FastAPI Gen AI on `http://localhost:8000`
- Starts React Frontend on `http://localhost:5173`
- Opens your browser automatically!

### 1-Click Multi-Spider Crawler
Double-click **`run_all_spiders.bat`** to run all 7 scholarship and campus document scrapers in sequence.
