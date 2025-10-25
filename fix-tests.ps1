# PowerShell script to fix all test files
$testFiles = @(
    "clock-drawing.tsx",
    "naming.tsx",
    "attention-forward.tsx",
    "attention-backward.tsx",
    "attention-vigilance.tsx",
    "sentence-repetition.tsx",
    "verbal-fluency.tsx",
    "abstraction.tsx",
    "delayed-recall.tsx",
    "orientation.tsx"
)

$testsDir = "c:\Users\wanna\Desktop\RPC2.0\frontend\src\pages\tests"

foreach ($file in $testFiles) {
    $filePath = Join-Path $testsDir $file
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Fix sessionStorage keys
        $content = $content -replace "sessionStorage\.getItem\('userId'\)", "sessionStorage.getItem('user_id')"
        $content = $content -replace "sessionStorage\.getItem\('sessionId'\)", "sessionStorage.getItem('session_id')"
        
        # Fix API URLs
        $content = $content -replace "process\.env\.NEXT_PUBLIC_API_URL", "(process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com')"
        $content = $content -replace "process\.env\.NEXT_PUBLIC_BACKEND_URL", "(process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com')"
        
        # Fix API endpoints to use correct path
        $content = $content -replace "/api/score/", "/scoring/"
        $content = $content -replace "/api/scoring/", "/scoring/"
        
        Set-Content $filePath $content -NoNewline
        Write-Host "Updated $file" -ForegroundColor Green
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done updating test files." -ForegroundColor Cyan