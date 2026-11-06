# =====================================================================
# ChronoZero: Blockchain Exploit Defect Lab & Multi-Agent War Room
# PowerShell Startup Script for Windows 11
# =====================================================================

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   ChronoZero - Blockchain Exploit Defect Lab (Windows 11 Launcher)   " -ForegroundColor Cyan
Write-Host "   Multi-Agent Adversarial Debate Arena & Cryptanalysis Suite         " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verify Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed on your system!" -ForegroundColor Red
    Write-Host "Download and install Node.js v20+ LTS from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installing, re-run this script." -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

$nodeVersion = node -v
Write-Host "[OK] Node.js detected: $nodeVersion" -ForegroundColor Green

# 2. Environment file check
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "[INFO] Initializing .env configuration from .env.example..." -ForegroundColor Gray
        Copy-Item ".env.example" ".env"
    } else {
        Write-Host "[WARN] No .env or .env.example found - server will use built-in defaults." -ForegroundColor Yellow
    }
}

# 3. Dependencies check
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies (first run, may take a few minutes)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] npm install failed. Please check internet connection." -ForegroundColor Red
        Read-Host "Press Enter to exit..."
        exit 1
    }
} else {
    Write-Host "[OK] Dependencies already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "[INFO] Launching ChronoZero server..." -ForegroundColor Cyan
Write-Host "[INFO] Your browser will open automatically as soon as the server is live." -ForegroundColor Gray
Write-Host "[INFO] Press Ctrl+C in this console window to stop the server." -ForegroundColor Yellow
Write-Host ""

# The SERVER opens the browser the moment it is actually listening
# (AUTO_OPEN_BROWSER=1 below), so the browser can never open too early.
$env:AUTO_OPEN_BROWSER = "1"

# Start the full-stack server
npm run dev

Write-Host ""
Write-Host "[INFO] ChronoZero has stopped." -ForegroundColor Gray
Read-Host "Press Enter to exit..."
