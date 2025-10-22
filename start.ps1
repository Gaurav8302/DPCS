# Dimentia Project - Quick Start Script for Windows
# Run this script to set up and start both backend and frontend

Write-Host "🧠 Dimentia Project - Quick Start" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠ .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please edit .env file with your MongoDB credentials before continuing." -ForegroundColor Yellow
    Write-Host "Press any key when ready..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Backend setup
Write-Host "Setting up backend..." -ForegroundColor Yellow
Push-Location backend

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment and install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
pip install -q -r requirements.txt

# Copy .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Copy-Item "..\.env" ".env"
}

Pop-Location

# Frontend setup
Write-Host "Setting up frontend..." -ForegroundColor Yellow
Push-Location frontend

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install --silent
}

# Copy .env.local if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Copy-Item "..\.env" ".env.local"
}

Pop-Location

Write-Host ""
Write-Host "✓ Setup complete!" -ForegroundColor Green
Write-Host ""

# Ask user if they want to start servers
$response = Read-Host "Start both servers now? (Y/n)"
if ($response -eq "" -or $response -eq "y" -or $response -eq "Y") {
    Write-Host ""
    Write-Host "Starting servers..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Backend will run at: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Frontend will run at: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
    Write-Host ""
    
    # Start backend in new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload --port 8000"
    
    # Wait a moment for backend to start
    Start-Sleep -Seconds 3
    
    # Start frontend in new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
    
    Write-Host "✓ Servers started in separate windows!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To view the application:" -ForegroundColor Yellow
    Write-Host "  • Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  • API Docs: http://localhost:8000/docs" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "To start servers manually:" -ForegroundColor Yellow
    Write-Host "  Backend:  cd backend; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload" -ForegroundColor White
    Write-Host "  Frontend: cd frontend; npm run dev" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
