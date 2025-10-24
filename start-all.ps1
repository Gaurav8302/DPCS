# ================================================
# Start Both Backend and Frontend Servers
# Dimentia Project v2.0
# ================================================

Write-Host "🚀 Starting Dimentia Project - Full Stack" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to start a process in a new window
function Start-InNewWindow {
    param(
        [string]$Title,
        [string]$Command
    )
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $Command -WindowStyle Normal
}

Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Start-InNewWindow -Title "Backend" -Command "cd '$PSScriptRoot'; .\start-backend.ps1"

Write-Host "⏳ Waiting 5 seconds for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-InNewWindow -Title "Frontend" -Command "cd '$PSScriptRoot'; .\start-frontend.ps1"

Write-Host ""
Write-Host "✨ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Your application will be available at:" -ForegroundColor Cyan
Write-Host "  🌐 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  🔧 Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  📖 API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Close the backend and frontend terminal windows to stop the servers" -ForegroundColor Gray
Write-Host ""
