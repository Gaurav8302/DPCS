# ================================================
# Local Development Setup Script
# Dimentia Project v2.0
# ================================================

Write-Host "🧠 Dimentia Project - Local Development Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Python
if (Test-CommandExists python) {
    $pythonVersion = python --version
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Python not found! Please install Python 3.11+ from https://www.python.org/" -ForegroundColor Red
    exit 1
}

# Check Node.js
if (Test-CommandExists node) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found! Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "🔧 Setting up Backend..." -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan

# Navigate to backend
Set-Location -Path "$PSScriptRoot\backend"

# Check if virtual environment exists
if (Test-Path "venv311") {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
} else {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv311
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment and install dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
Write-Host "(This may take a few minutes...)" -ForegroundColor Gray

# Use PowerShell to run commands in activated venv
& "$PSScriptRoot\backend\venv311\Scripts\Activate.ps1"
pip install --upgrade pip
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some backend dependencies may have had issues" -ForegroundColor Yellow
}

# Check .env file
if (Test-Path ".env") {
    Write-Host "✅ Backend .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️ Backend .env file not found!" -ForegroundColor Yellow
    Write-Host "   Please copy .env.example to .env and configure it" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "🎨 Setting up Frontend..." -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan

# Navigate to frontend
Set-Location -Path "$PSScriptRoot\frontend"

# Install frontend dependencies
Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Yellow
Write-Host "(This may take a few minutes...)" -ForegroundColor Gray

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend dependencies installation failed" -ForegroundColor Red
    exit 1
}

# Check .env.local file
if (Test-Path ".env.local") {
    Write-Host "✅ Frontend .env.local file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️ Frontend .env.local file not found!" -ForegroundColor Yellow
    Write-Host "   Please copy .env.local.example to .env.local" -ForegroundColor Yellow
}

# Return to root
Set-Location -Path $PSScriptRoot

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. To start the backend server:" -ForegroundColor White
Write-Host "   .\start-backend.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. To start the frontend (in a new terminal):" -ForegroundColor White
Write-Host "   .\start-frontend.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Or run both together:" -ForegroundColor White
Write-Host "   .\start-all.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Read LOCAL_SETUP.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
