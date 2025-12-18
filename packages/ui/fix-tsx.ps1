# Global TSX Block Fixer
Write-Host "Fixing all TSX live blocks..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "docs/components" -Filter "*.md" -Recurse

$totalFixed = 0
$patterns = @(
    @{ Pattern = '\{\s+\{'; Replacement = '{{' },
    @{ Pattern = '\}\s+\}'; Replacement = '}}' },
    @{ Pattern = '\{\s*(\w+)\}\s+<'; Replacement = '{$1}<' },
    @{ Pattern = '\{\s+(\w+)'; Replacement = '{$1' },
    @{ Pattern = '(\w+)\s+\}'; Replacement = '$1}' }
)

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    foreach ($fix in $patterns) {
        $content = $content -replace $fix.Pattern, $fix.Replacement
    }
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalFixed++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nFixed $totalFixed files!" -ForegroundColor Green
Write-Host "Now run: npm run docs build" -ForegroundColor Yellow
