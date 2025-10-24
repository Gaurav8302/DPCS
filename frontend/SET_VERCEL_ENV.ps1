# Quick script to set Vercel environment variables
# Make sure you have Vercel CLI installed: npm i -g vercel

Write-Host "🔧 Setting Vercel Environment Variables..." -ForegroundColor Cyan

# Generate NEXTAUTH_SECRET
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

Write-Host "`n✅ Generated NEXTAUTH_SECRET: $secret" -ForegroundColor Green

# Set environment variables
Write-Host "`n📝 Setting NEXT_PUBLIC_BACKEND_URL..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_BACKEND_URL production

Write-Host "`n📝 Setting NEXTAUTH_URL..." -ForegroundColor Yellow
vercel env add NEXTAUTH_URL production

Write-Host "`n📝 Setting NEXTAUTH_SECRET..." -ForegroundColor Yellow
vercel env add NEXTAUTH_SECRET production

Write-Host "`n🚀 Deploying to production..." -ForegroundColor Cyan
vercel --prod

Write-Host "`n✅ Done! Check your deployment at Vercel dashboard" -ForegroundColor Green
Write-Host "Your site should now connect to: https://dpcs.onrender.com" -ForegroundColor Green
