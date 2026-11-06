@echo off
TITLE ChronoZero: Blockchain Exploit Defect Lab and Multi-Agent War Room
COLOR 0B
setlocal

echo ======================================================================
echo    ChronoZero - Blockchain Exploit Defect Lab
echo    Multi-Agent Adversarial Debate Arena + Obsidian Knowledge Vault
echo ======================================================================
echo.
echo   First time? Open the "Knowledge Vault" tab and paste your vault
echo   path (e.g. D:\AI-Research\ChronoZero-Vault). Everything is free.
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not found on this PC.
    echo         Install Node.js v20+ LTS from https://nodejs.org then run this file again.
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js detected:
node -v
echo.

:: 2. Ensure .env exists (create from template on first run)
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Creating .env from .env.example...
        copy /y .env.example .env >nul
    ) else (
        echo [WARN] No .env or .env.example found - server will use built-in defaults.
    )
)

:: 3. Install dependencies on first run
if not exist "node_modules\" (
    echo [INFO] Installing required npm packages (first-time setup, may take a few minutes)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed. Check your internet connection and run this file again.
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed.
)

:: 4. Launch the full-stack server.
::    The SERVER opens your browser automatically the moment it is actually
::    live (AUTO_OPEN_BROWSER=1), so the browser can never open too early.
echo.
echo [INFO] Starting ChronoZero...
echo [INFO] Your browser will open automatically as soon as the server is live.
echo [INFO] Keep this window open. Press Ctrl+C here (or close it) to stop the server.
echo.
set AUTO_OPEN_BROWSER=1
call npm run dev

echo.
echo [INFO] ChronoZero has stopped.
pause
