# Restart Frontend to Pick Up New Environment Variables

Write-Host "Stopping any running Next.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*frontend*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Waiting for processes to stop..." -ForegroundColor Gray
Start-Sleep -Seconds 2

Write-Host "Starting frontend with updated configuration..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\frontend"

Write-Host ""
Write-Host "Frontend will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Check browser console for API URL" -ForegroundColor Yellow
Write-Host "  Should see: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run dev
