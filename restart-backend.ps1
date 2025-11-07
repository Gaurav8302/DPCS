# Restart Backend with Bug Fix

Write-Host "Stopping backend server..." -ForegroundColor Yellow
Get-Process -Name python -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*venv311*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Waiting for process to stop..." -ForegroundColor Gray
Start-Sleep -Seconds 2

Write-Host "Starting backend with bug fix..." -ForegroundColor Green
Write-Host ""
Write-Host "Bug Fixed: Firestore _id query now uses document ID lookup" -ForegroundColor Cyan
Write-Host ""

& "$PSScriptRoot\start-backend.ps1"
