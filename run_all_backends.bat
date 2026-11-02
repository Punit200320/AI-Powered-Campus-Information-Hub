@echo off
title Campus Information Hub - All Microservices Launcher
color 0A

echo ========================================================
echo    AI-Powered Campus Information Hub - Backend Suite
echo ========================================================
echo.

REM --- Rotated JWT secret (shared by Spring Boot + FastAPI) ---
set CAMPUS_JWT_SECRET=caae61961a7cf5af4e8995a6ff6246d3bcc84f485951514b41a48b0ba05ddd0322c9df0d0ab7acb25ba92c84aa3d9ec6
set JWT_SECRET=caae61961a7cf5af4e8995a6ff6246d3bcc84f485951514b41a48b0ba05ddd0322c9df0d0ab7acb25ba92c84aa3d9ec6

REM --- Google OAuth2 credentials (Spring Boot reads these as env vars) ---
set GOOGLE_CLIENT_ID=399397515522-4kg61f78vfsv8j3r6nb7kkb8bbpiacqr.apps.googleusercontent.com
set GOOGLE_CLIENT_SECRET=GOCSPX-pOY8n-Tk7_R-_FEK_oiGMzQtY55
set GOOGLE_REDIRECT_URI=http://localhost:5000/login/oauth2/code/google
set FRONTEND_URL=http://localhost:5173


echo [1/2] Starting Spring Boot Core Service (Port 5000)...
start "CampusAI - Spring Boot Service (Port 5000)" cmd /k "cd backend\microservices\spring-boot-service && java -jar target\campus-ai-backend-1.0.0.jar"

echo [2/2] Starting FastAPI Gen AI & RAG Engine (Port 8000)...
start "CampusAI - Gen AI & RAG Service (Port 8000)" cmd /k "cd backend\microservices\gen-ai-and-rag-service && C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe main.py"

echo.
echo ========================================================
echo All Microservices are launching in separate windows!
echo - Spring Boot API:  http://localhost:5000 (Auth, DB, Resources, Admin)
echo - FastAPI Gen AI:   http://localhost:8000 (Chatbot, RAG, Quiz, Summarizer)
echo - Frontend UI:      http://localhost:8081 or 5173
echo ========================================================
echo.
pause

