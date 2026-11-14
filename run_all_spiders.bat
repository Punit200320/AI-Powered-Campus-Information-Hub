@echo off
title Campus Information Hub - All Spiders Runner
color 0E

echo ========================================================
echo    Running All Scholarships, Counselling ^& Docs Spiders
echo ========================================================
echo.

set "PY_CMD=python"
if exist "C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe" (
    set "PY_CMD=C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe"
) else if exist "%~dp0.venv\Scripts\python.exe" (
    set "PY_CMD=%~dp0.venv\Scripts\python.exe"
)

set "SCRAPY_CMD=scrapy"
if exist "C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\scrapy.exe" (
    set "SCRAPY_CMD=C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\scrapy.exe"
)

cd /d "%~dp0backend\microservices\webscraping-service"
set "PYTHONPATH=%~dp0backend\microservices\webscraping-service;%PYTHONPATH%"

echo [1/9] Running MPTAAS Scholarship Spider...
"%SCRAPY_CMD%" runspider spiders\mptaas_spider.py
echo.

echo [2/9] Running MMVY Scholarship Spider...
"%SCRAPY_CMD%" runspider spiders\mmvy_spider.py
echo.

echo [3/9] Running Reliance Foundation Spider...
"%SCRAPY_CMD%" runspider spiders\reliance_spider.py
echo.

echo [4/9] Running Tata Trust Scholarship Spider...
"%SCRAPY_CMD%" runspider spiders\tata_spider.py
echo.

echo [5/9] Running Aditya Birla Scholarship Spider...
"%SCRAPY_CMD%" runspider spiders\birla_spider.py
echo.

echo [6/9] Running National Scholarships Portal Spider...
"%SCRAPY_CMD%" runspider spiders\national_spider.py
echo.

echo [7/9] Running MP DTE Centralized Counselling Spider (B.Tech, Lateral, TFW)...
"%SCRAPY_CMD%" runspider spiders\mp_dte_counselling_spider.py
echo.

echo [8/9] Running JoSAA & CSAB Centralized Counselling Spider (IITs, NITs, IIITs)...
"%SCRAPY_CMD%" runspider spiders\josaa_counselling_spider.py
echo.

echo [9/9] Running Campus Academic Documents Spider (PYQs, Notices, Notes, Brochures)...
"%PY_CMD%" spiders\campus_docs_spider.py
echo.

echo ========================================================
echo All 9 Scrapers Completed! Database ^& Google Sheets Synced.
echo ========================================================
if not "%1"=="--no-pause" (
    if "%CI%"=="" if "%AUTOMATED%"=="" timeout /t 3 >nul 2>&1
)

