@echo off
title Campus AI - Gen AI / RAG Backend (correct project)
color 0A
echo ============================================================
echo   Starting Campus AI Gen AI / RAG Backend
echo   Project: New_Project
echo   Port:    8000
echo   NOTE: This uses the CORRECT New_Project code (has scraped docs)
echo ============================================================
set "PY=C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe"
if not exist "%PY%" set "PY=python"

cd /d "%~dp0backend\microservices\gen-ai-and-rag-service"
"%PY%" main.py
pause
