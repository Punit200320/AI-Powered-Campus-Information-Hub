# AI-Powered Campus Information Hub

A modern, microservices-based academic intelligence and scholarship discovery platform for university students.

## 🏗️ Architecture & Project Structure

```text
AI-Powered-Campus-Information-Hub/
│
├── Frontend/                           # 🌐 Service 1: React, Tailwind CSS & Vite (Port 8081 / 5173)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── services/                           # ⚙️ Microservices Backend
│   │
│   ├── ai-service/                     # 🤖 Service 2: FastAPI + OpenRouter RAG Service (Port 8000)
│   │   ├── main.py                     # -> POST /api/v1/chat/generate, GET /api/v1/scholarships
│   │   └── requirements.txt
│   │
│   ├── crawler-service/                # 🕷️ Service 3: Scrapy Web Crawler & Google Sheet Pipeline
│   │   ├── scholarship_spider.py       # -> Automated portal crawling
│   │   └── requirements.txt
│   │
│   └── docs-service/                   # 📁 Service 4: Google Drive Document Sync
│       ├── drive_manager.py            # -> PYQ, Notices, Notes, Brochures
│       └── requirements.txt
│
├── config/                             # 🔐 Configuration & Secrets (Git-ignored)
│   ├── credentials.json                # -> Google Cloud Service Account Key
│   └── .env.example                    # -> Environment variables template
│
├── run_ai_backend.bat                  # 🚀 One-Click AI Service Launcher
├── .gitignore
└── README.md
```

## 🚀 Quick Start Guide

### 1. Run Frontend
```bash
cd Frontend
npm install
npm run dev
```
Accessible at: `http://localhost:8081` (or `http://localhost:5173`)

### 2. Run AI Microservice Backend
Double-click `run_ai_backend.bat` OR run:
```bash
cd services/ai-service
python main.py
```
API Documentation: `http://localhost:8000/docs`

### 3. Run Web Crawler
```bash
cd services/crawler-service
python scholarship_spider.py
```
Updates live records in Google Sheets (`Scholarships_DB`).

### 4. Sync Drive Documents
```bash
cd services/docs-service
python drive_manager.py
```
Syncs PYQ, Notes, and Notices from Google Drive.
