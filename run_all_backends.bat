@echo off
title Campus Information Hub - All Microservices Launcher
color 0A

echo ========================================================
echo    AI-Powered Campus Information Hub - Backend Suite
echo ========================================================
echo.

REM ---------------------------------------------------------------
REM Load secrets from config\.env if present; auto-create if missing.
REM ---------------------------------------------------------------
if not exist "%~dp0config\.env" (
    if exist "%~dp0config\.env.example" (
        copy "%~dp0config\.env.example" "%~dp0config\.env" >nul
        echo [INFO] Created config\.env from template.
    )
)
if exist "%~dp0config\.env" (
    for /f "usebackq eol=# tokens=1,* delims==" %%a in ("%~dp0config\.env") do set "%%a=%%b"
)

REM ---------------------------------------------------------------
REM Detect Python executable
REM ---------------------------------------------------------------
set "PY_CMD=python"
if exist "C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe" (
    set "PY_CMD=C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe"
) else if exist "%~dp0.venv\Scripts\python.exe" (
    set "PY_CMD=%~dp0.venv\Scripts\python.exe"
)

echo [1/2] Starting Spring Boot Core Service (Port 5000)...
start "CampusAI - Spring Boot Service (Port 5000)" cmd /k "cd /d %~dp0backend\microservices\spring-boot-service && java -jar target\campus-ai-backend-1.0.0.jar"

echo [2/2] Starting FastAPI Gen AI & RAG Engine (Port 8000)...
start "CampusAI - Gen AI & RAG Service (Port 8000)" cmd /k "cd /d %~dp0backend\microservices\gen-ai-and-rag-service && "%PY_CMD%" main.py"

echo.
echo ========================================================
echo Microservices launched in separate windows!
echo - Spring Boot API:  http://localhost:5000
echo - FastAPI Gen AI:   http://localhost:8000
echo ========================================================
echo.
pause
