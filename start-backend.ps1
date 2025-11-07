# Start Backend Server (Local Development)
# Dimentia Project v2.0

Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location -Path "$PSScriptRoot\backend"

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please run setup-local.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Check if venv exists
if (-not (Test-Path "venv311")) {
    Write-Host "ERROR: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run setup-local.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "$PSScriptRoot\backend\venv311\Scripts\Activate.ps1"

Write-Host "Starting FastAPI server..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  Health Check: http://localhost:8000/health" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start uvicorn server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
