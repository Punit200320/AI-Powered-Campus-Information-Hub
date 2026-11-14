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
    for /f "usebackq eol=# tokens=1* delims==" %%a in ("%~dp0config\.env") do set "%%a=%%b"
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

REM ---------------------------------------------------------------
REM Spring Boot: ensure jar exists, else build via Maven.
REM ---------------------------------------------------------------
set "SPRING_JAR=%~dp0backend\microservices\spring-boot-service\target\campus-ai-backend-1.0.0.jar"
if not exist "%SPRING_JAR%" (
    echo [INFO] Spring Boot jar missing - building with Maven...
    pushd "%~dp0backend\microservices\spring-boot-service"
    call mvn -q -DskipTests package
    popd
)
if not exist "%SPRING_JAR%" (
    echo [ERROR] Could not build Spring Boot jar. Check Maven/java install.
    pause
    exit /b 1
)
echo [1/2] Starting Spring Boot Core Service (Port 5000)...
start "CampusAI - Spring Boot Service (Port 5000)" cmd /k "cd /d %~dp0backend\microservices\spring-boot-service && java -jar target\campus-ai-backend-1.0.0.jar"
call :wait_port "http://localhost:5000/" "Spring Boot API" 60

echo [2/2] Starting FastAPI Gen AI & RAG Engine (Port 8000)...
start "CampusAI - Gen AI & RAG Service (Port 8000)" cmd /k "cd /d %~dp0backend\microservices\gen-ai-and-rag-service && "%PY_CMD%" main.py"
call :wait_port "http://localhost:8000/health" "FastAPI Gen AI" 30

echo.
echo ========================================================
echo Microservices launched in separate windows!
echo - Spring Boot API:  http://localhost:5000
echo - FastAPI Gen AI:   http://localhost:8000
echo ========================================================
echo.
pause
REM ---------------------------------------------------------------
REM wait_port <url> <label> <max_tries>
REM ---------------------------------------------------------------
:wait_port
set "WP_URL=%~1"
set "WP_LABEL=%~2"
set "WP_MAX=%~3"
if "%WP_MAX%"=="" set "WP_MAX=45"
set "WP_TRIES=0"
:wait_loop
set /a WP_TRIES+=1
curl -s -o nul -w "%%{http_code}" "%WP_URL%" > "%TEMP%\_campus_http.txt" 2>nul
set /p WP_CODE=<"%TEMP%\_campus_http.txt"
if "%WP_CODE%"=="200" (
    echo [OK] %WP_LABEL% is UP (http %WP_CODE%).
    del "%TEMP%\_campus_http.txt" >nul 2>nul
    goto :eof
)
if %WP_TRIES% GEQ %WP_MAX% (
    echo [WARN] %WP_LABEL% did not become healthy after %WP_MAX% tries.
    del "%TEMP%\_campus_http.txt" >nul 2>nul
    goto :eof
)
timeout /t 1 /nobreak >nul
goto :wait_loop
