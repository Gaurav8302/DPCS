# ================================================
# Git Push Script - Push All Changes to Main
# ================================================

Write-Host "🚀 Preparing to push to Git..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not found!" -ForegroundColor Red
    Write-Host "Initialize git first with: git init" -ForegroundColor Yellow
    exit 1
}

# Show current status
Write-Host "📊 Current Git Status:" -ForegroundColor Yellow
git status
Write-Host ""

# Confirm push
$response = Read-Host "Do you want to commit and push all changes? (yes/no)"
if ($response -ne "yes") {
    Write-Host "❌ Push cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📦 Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = "Production ready: All bugs fixed - CORS configured, NextAuth added, Firebase setup, deployment guides included"
git commit -m $commitMessage

Write-Host ""
Write-Host "🌐 Pushing to main branch..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Enable Firestore: https://console.firebase.google.com/project/dpcs-67de3/firestore" -ForegroundColor White
    Write-Host "2. Deploy backend to Render: https://dashboard.render.com/" -ForegroundColor White
    Write-Host "3. Deploy frontend to Vercel: https://vercel.com/new" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 See DEPLOYMENT_PRODUCTION.md for detailed instructions" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Push failed! Check error messages above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Not authenticated with GitHub" -ForegroundColor White
    Write-Host "- Remote repository not set" -ForegroundColor White
    Write-Host "- Merge conflicts" -ForegroundColor White
}
