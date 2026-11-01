# AI-Powered Campus Information Hub 🎓🚀

A modern microservices-based campus platform designed for university students, faculty, and administrators. Combines **Spring Boot Enterprise Architecture** with **FastAPI Generative AI / RAG**, **Scrapy Web Scraping**, and **Google Cloud Suite (Drive & Sheets)**.

---

## 🏛️ Project Architecture

```
AI-Powered-Campus-Information-Hub/
│
├── Frontend/                                       # 🌐 React 18 + Tailwind CSS UI (Port 8081 / 5173)
│
├── backend/
│   └── microservices/
│       │
│       ├── spring-boot-service/                    # ☕ Core Academic & Auth Microservice (Port 5000)
│       │   ├── src/main/java/com/campusai/
│       │   │   ├── config/                         # SecurityConfig & JwtAuthFilter
│       │   │   ├── controller/                     # Auth, Resources, Admin, Health Controllers
│       │   │   ├── dto/                            # Login, Register, AuthResponse DTOs
│       │   │   ├── model/                          # User and Resource JPA Entities
│       │   │   ├── repository/                     # Spring Data JPA Repositories
│       │   │   └── service/                        # JwtService (HMAC SHA-512)
│       │   ├── src/main/resources/
│       │   │   ├── application.properties          # Port 5000, H2 in-memory DB, JPA config
│       │   │   └── data.sql                        # Seed users (student, faculty, admin) & 12+ resources
│       │   ├── target/campus-ai-backend-1.0.0.jar  # Production executable JAR
│       │   └── pom.xml
│       │
│       ├── gen-ai-and-rag-service/                 # 🤖 Gen AI, RAG & Chatbot Microservice (Port 8000)
│       │   ├── main.py                             # FastAPI server (Chatbot RAG, Quiz, Summarizer)
│       │   └── requirements.txt
│       │
│       ├── webscraping-service/                    # 🕷️ Scrapy Spider Microservice
│       │   ├── scholarship_spider.py               # Live opportunity scraper -> Google Sheets
│       │   └── requirements.txt
│       │
│       └── docs-service/                           # 📁 Google Drive Sync Service
│           ├── drive_manager.py                    # Indexes PYQ, Notes, Notices, Brochures
│           └── requirements.txt
│
├── config/
│   ├── credentials.json                            # 🔐 Google Service Account key (Git-ignored)
│   └── .env.example                                # Template for API keys
│
├── run_all_backends.bat                            # 🚀 1-Click launcher for both services
├── run_ai_backend.bat                              # 1-Click launcher for FastAPI
└── .gitignore                                      # Safe git configuration
```

---

## 🔌 API Contracts & Microservices Endpoints

### 1. Spring Boot Core Service (`http://localhost:5000`)
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Service health status |
| `POST` | `/api/auth/login` | JWT Authentication (Student / Faculty / Admin) |
| `POST` | `/api/auth/register` | New user onboarding |
| `POST` | `/api/auth/logout` | Token invalidation |
| `GET` | `/api/resources/search` | Dynamic keyword & filter search for study materials |
| `GET` | `/api/resources/top` | Top-downloaded academic resources |
| `GET` | `/api/admin/stats` | Analytics, query logs & pending documents queue |
| `POST` | `/api/admin/documents/{id}/approve` | Approve and index uploaded documents |
| `DELETE` | `/api/admin/documents/{id}` | Delete document from catalog |

**Demo Credentials (`password123` for all):**
- **Student:** `alex.vance@campus.edu`
- **Faculty:** `e.reed@campus.edu`
- **Admin:** `m.brody@campus.admin`

---

### 2. FastAPI Gen AI & RAG Service (`http://localhost:8000`)
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/health` | Health & AI Model Status |
| `GET` | `/api/v1/scholarships` | Fetch live scholarships from Google Sheets |
| `POST` | `/api/v1/chat/generate` | RAG Chatbot with Google Sheets context & citations |
| `POST` | `/api/v1/quiz/generate` | AI MCQ Generator by Subject & Unit |
| `POST` | `/api/v1/summarize/upload` | PDF & Document Summarizer Engine |

---

## 🚀 How to Run Everything

### Quick Start (Windows)
Double click `run_all_backends.bat` to launch both the Spring Boot and FastAPI microservices simultaneously in separate console windows.

### Manual Commands
```bash
# 1. Spring Boot (Port 5000)
cd backend/microservices/spring-boot-service
java -jar target/campus-ai-backend-1.0.0.jar

# 2. FastAPI AI & RAG (Port 8000)
cd backend/microservices/gen-ai-and-rag-service
python main.py

# 3. Web Scraper
cd backend/microservices/webscraping-service
python scholarship_spider.py

# 4. Frontend UI (Port 8081 / 5173)
cd Frontend
npm install
npm run dev
```
