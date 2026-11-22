# 🛠️ Setup & Run Guide

Complete guide to install, configure, and run the AI-Powered Campus Information Hub on Windows.

---

## 1. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Python | 3.10+ | Tested on 3.14. Create a venv in the project root: `python -m venv venv` |
| Node.js | 18+ | npm 10+ |
| Java | 17+ | For Spring Boot |
| Maven | 3.8+ | Optional (wrapper/target jar provided) |
| Git | 2.x | For cloning/versioning |

### 1.1 Python venv & deps
```bash
# activate venv
venv\Scripts\activate

# FastAPI service
cd backend/microservices/gen-ai-and-rag-service
pip install -r requirements.txt

# scraping service
cd ../webscraping-service
pip install -r requirements.txt

# docs service
cd ../docs-service
pip install -r requirements.txt
```

### 1.2 Frontend
```bash
cd Frontend
npm install
```

### 1.3 Spring Boot
```bash
cd backend/microservices/spring-boot-service
mvn clean package   # produces target/campus-ai-backend-1.0.0.jar
```

---

## 2. Configuration (`config/.env`)

Copy `config/.env.example` → `config/.env` and fill in:

| Variable | Purpose |
|---|---|
| `JWT_SECRET` / `CAMPUS_JWT_SECRET` | Token signing (long random hex). Generate: `python -c "import secrets; print(secrets.token_hex(48))"` |
| `GOOGLE_CLIENT_ID` | Web OAuth client id for SSO |
| `GOOGLE_CLIENT_SECRET` | Web OAuth client secret |
| `GOOGLE_REDIRECT_URI` | `http://localhost:5000/login/oauth2/code/google` |
| `FRONTEND_URL` | `http://localhost:5173` |
| `GROQ_API_KEY` | Optional primary LLM provider |
| `GEMINI_API_KEY` | Optional LLM provider |
| `OPENROUTER_API_KEY` | Optional LLM provider |
| `SPRING_MAIL_*` | SMTP for email notifications |
| `FAST2SMS_API_KEY` / `TWILIO_*` | SMS service |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service-account `credentials.json` for Drive |

> ⚠️ **Spring Boot MUST be started with `start_spring_boot.bat`** (or `run_full_project.bat`) so it loads `config/.env`. Running bare `java -jar` leaves OAuth vars empty → Google `invalid_client` error.

---

## 3. Running the stack

### Full stack (1 click)
```
run_full_project.bat
```

### Individual services
| Service | Command | URL |
|---|---|---|
| Spring Boot | `start_spring_boot.bat` | http://localhost:5000 |
| FastAPI | `python -m uvicorn main:app --host 127.0.0.1 --port 8000` (in gen-ai-and-rag-service) | http://localhost:8000 |
| Frontend | `npm run dev` (in Frontend) | http://localhost:5173 |

### Scrapers
```
run_all_spiders.bat
```
Runs 9 spiders in sequence (MPTAAS, MMVY, Reliance, Tata, Birla, National, MP-DTE, JoSAA, Campus Docs).

---

## 4. Google Cloud Setup

### 4.1 OAuth client (SSO)
1. Console → **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Type **Web application**, set:
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URI: `http://localhost:5000/login/oauth2/code/google`
3. Copy `Client ID` + `Client secret` into `config/.env`.

### 4.2 Service account (Drive)
1. Console → **Service Accounts → Create**.
2. Download the `credentials.json` → place at `config/credentials.json`.
3. Share your Drive folders with the service-account email (`xxx@project.iam.gserviceaccount.com`) with **Editor** rights.

### 4.3 Drive folder IDs (in `docs-service/drive_manager.py`)
```
PYQ:       1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x
Notices:   1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q
Notes:     17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw
Brochures: 1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh
```

---

## 5. Troubleshooting

| Problem | Fix |
|---|---|
| Google `invalid_client` | Start Spring via `start_spring_boot.bat` (env loaded). Check client id/secret match. |
| LLM summary placeholder "See official notice below" | Ensure FastAPI is running; call `/documents/{id}/summary`. Cached in `_cache/structured_summaries.json`. |
| Scrapy not found | Use your project's virtualenv — e.g. activate it (`venv\Scripts\activate`) and run `scrapy`, or call `%SCRAPY_VENV%\Scripts\scrapy.exe` where `%SCRAPY_VENV%` is your own venv root. |
| Port in use | Kill old process on 8000/5000/5173 before restart. |
| OCR/Devanagari summary absent | Install Tesseract (`tesseract` on PATH) and/or `easyocr`. |

---

## 6. Backup
Before any patch, backups are written to `patch_backups/` (timestamped `.bak`).
