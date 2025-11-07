# Verify Localhost Configuration

Write-Host "Verifying Localhost Configuration..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check frontend .env.local
Write-Host "[1/4] Checking Frontend Configuration..." -ForegroundColor Yellow
$frontendEnv = "frontend\.env.local"
if (Test-Path $frontendEnv) {
    $content = Get-Content $frontendEnv -Raw
    if ($content -match "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000") {
        Write-Host "  OK - Frontend points to localhost backend" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - Frontend NOT pointing to localhost!" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "  ERROR - frontend\.env.local NOT FOUND!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check backend .env
Write-Host "[2/4] Checking Backend Configuration..." -ForegroundColor Yellow
$backendEnv = "backend\.env"
if (Test-Path $backendEnv) {
    $content = Get-Content $backendEnv -Raw
    
    if ($content -match "FIREBASE_PROJECT_ID=") {
        Write-Host "  OK - Firebase credentials present" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - Firebase credentials MISSING!" -ForegroundColor Red
        $allGood = $false
    }
    
    if ($content -match "ALLOWED_ORIGINS=.*localhost:3000") {
        Write-Host "  OK - CORS allows localhost" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - CORS might not allow localhost!" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "  ERROR - backend\.env NOT FOUND!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check if backend venv exists
Write-Host "[3/4] Checking Backend Virtual Environment..." -ForegroundColor Yellow
if (Test-Path "backend\venv311") {
    Write-Host "  OK - Virtual environment exists" -ForegroundColor Green
} else {
    Write-Host "  ERROR - Virtual environment NOT FOUND!" -ForegroundColor Red
    Write-Host "         Run: .\setup-local.ps1" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# Check if frontend node_modules exists
Write-Host "[4/4] Checking Frontend Dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "  OK - Node modules installed" -ForegroundColor Green
} else {
    Write-Host "  ERROR - Node modules NOT FOUND!" -ForegroundColor Red
    Write-Host "         Run: cd frontend; npm install" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "SUCCESS - All checks passed! Ready to run locally." -ForegroundColor Green
    Write-Host ""
    Write-Host "Start servers with: .\start-all.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Access at:" -ForegroundColor Cyan
    Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
    Write-Host "  Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "  API Docs:  http://localhost:8000/docs" -ForegroundColor White
    Write-Host "  Health:    http://localhost:8000/health" -ForegroundColor White
} else {
    Write-Host "FAILED - Some checks failed. Fix the issues above." -ForegroundColor Red
}

Write-Host ""
