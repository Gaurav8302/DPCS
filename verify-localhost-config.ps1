# Verify Localhost Configuration - Dimentia Project v2.0

Write-Host "Verifying Localhost Configuration..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check frontend .env.local
Write-Host "[1/4] Checking Frontend Configuration..." -ForegroundColor Yellow
$frontendEnv = "frontend\.env.local"
if (Test-Path $frontendEnv) {
    $content = Get-Content $frontendEnv -Raw
    if ($content -match "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000") {
        Write-Host "  ✅ Frontend points to localhost backend" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Frontend NOT pointing to localhost!" -ForegroundColor Red
        Write-Host "     Expected: NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" -ForegroundColor Yellow
        $allGood = $false
    }
    
    if ($content -match "NEXTAUTH_URL=http://localhost:3000") {
        Write-Host "  ✅ NextAuth configured for localhost" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  NextAuth URL might not be localhost" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ frontend\.env.local NOT FOUND!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check backend .env
Write-Host "📁 Checking Backend Configuration..." -ForegroundColor Yellow
$backendEnv = "backend\.env"
if (Test-Path $backendEnv) {
    $content = Get-Content $backendEnv -Raw
    
    if ($content -match "FIREBASE_PROJECT_ID=") {
        Write-Host "  ✅ Firebase credentials present" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Firebase credentials MISSING!" -ForegroundColor Red
        $allGood = $false
    }
    
    if ($content -match "ALLOWED_ORIGINS=.*localhost:3000") {
        Write-Host "  ✅ CORS allows localhost" -ForegroundColor Green
    } else {
        Write-Host "  ❌ CORS might not allow localhost!" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "  ❌ backend\.env NOT FOUND!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check if backend venv exists
Write-Host "📁 Checking Backend Virtual Environment..." -ForegroundColor Yellow
if (Test-Path "backend\venv311") {
    Write-Host "  ✅ Virtual environment exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Virtual environment NOT FOUND!" -ForegroundColor Red
    Write-Host "     Run: .\setup-local.ps1" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# Check if frontend node_modules exists
Write-Host "📁 Checking Frontend Dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "  ✅ Node modules installed" -ForegroundColor Green
} else {
    Write-Host "  ❌ Node modules NOT FOUND!" -ForegroundColor Red
    Write-Host "     Run: cd frontend; npm install" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✅ All checks passed! Ready to run locally." -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Start servers with:" -ForegroundColor Cyan
    Write-Host "   .\start-all.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "📍 Access at:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "   API Docs:  http://localhost:8000/docs" -ForegroundColor White
    Write-Host "   Health:    http://localhost:8000/health" -ForegroundColor White
} else {
    Write-Host "❌ Some checks failed. Please fix the issues above." -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Quick fixes:" -ForegroundColor Yellow
    Write-Host "   - Missing .env files? Copy from .env.example" -ForegroundColor White
    Write-Host "   - Missing venv? Run: .\setup-local.ps1" -ForegroundColor White
    Write-Host "   - Missing node_modules? Run: cd frontend; npm install" -ForegroundColor White
}

Write-Host ""
