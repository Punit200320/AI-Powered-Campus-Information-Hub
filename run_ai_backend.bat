@echo off
title Campus AI Microservice
echo ====================================================
echo Starting Campus AI Microservice on http://localhost:8000
echo Connected with Frontend: http://localhost:8081
echo ====================================================
cd services\ai-service
C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe main.py
pause

