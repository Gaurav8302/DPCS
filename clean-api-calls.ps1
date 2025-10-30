# Clean fix for all test files - properly format API calls
$testFiles = @(
    "clock-drawing.tsx",
    "naming.tsx",
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
        
        # Fix any double-nested environment variable issues
        $content = $content -replace '\$\{\(\(process\.env\.NEXT_PUBLIC_API_URL \|\| ''https://dpcs\.onrender\.com''\) \|\| ''https://dpcs\.onrender\.com''\)\}', '${apiUrl}'
        
        # Fix any single-nested issues
        $content = $content -replace '\$\{\(process\.env\.NEXT_PUBLIC_API_URL \|\| ''https://dpcs\.onrender\.com''\)\}', '${apiUrl}'
        
        # Ensure apiUrl variable is declared before fetch calls
        if ($content -match 'const response = await fetch' -and $content -notmatch 'const apiUrl = process\.env\.NEXT_PUBLIC_API_URL') {
            $content = $content -replace '(try \{[^\}]*?)(const response = await fetch)', "`$1`r`n      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com'`r`n      `$2"
        }
        
        Set-Content $filePath $content -NoNewline
        Write-Host "Cleaned $file" -ForegroundColor Green
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done cleaning test files." -ForegroundColor Cyan
