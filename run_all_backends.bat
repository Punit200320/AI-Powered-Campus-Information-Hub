@echo off
title Campus Information Hub - All Microservices Launcher
color 0A

echo ========================================================
echo    AI-Powered Campus Information Hub - Backend Suite
echo ========================================================
echo.
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

