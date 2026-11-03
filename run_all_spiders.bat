@echo off
title Campus Information Hub - All Spiders Runner
color 0E

echo ========================================================
echo    Running All Web Scraping Spiders & Document Sync
echo ========================================================
echo.

set "PY_CMD=python"
if exist "C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe" (
    set "PY_CMD=C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe"
) else if exist "%~dp0.venv\Scripts\python.exe" (
    set "PY_CMD=%~dp0.venv\Scripts\python.exe"
)

cd /d "%~dp0backend\microservices\webscraping-service"

echo [1/7] Running MPTAAS Scholarship Spider...
"%PY_CMD%" spiders\mptaas_spider.py
echo.

echo [2/7] Running MMVY Scholarship Spider...
"%PY_CMD%" spiders\mmvy_spider.py
echo.

echo [3/7] Running Reliance Foundation Spider...
"%PY_CMD%" spiders\reliance_spider.py
echo.

echo [4/7] Running Tata Trust Scholarship Spider...
"%PY_CMD%" spiders\tata_spider.py
echo.

echo [5/7] Running Aditya Birla Scholarship Spider...
"%PY_CMD%" spiders\birla_spider.py
echo.

echo [6/7] Running National Scholarships Portal Spider...
"%PY_CMD%" spiders\national_spider.py
echo.

echo [7/7] Running Campus Academic Documents Spider (PYQs, Notices, Notes, Brochures)...
"%PY_CMD%" spiders\campus_docs_spider.py
echo.

echo ========================================================
echo All Scrapers Completed! Database & Google Sheets Synced.
echo ========================================================
pause

