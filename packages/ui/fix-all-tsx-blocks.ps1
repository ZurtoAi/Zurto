# Global TSX Block Fixer - Fixes all VitePress markdown parsing issues
Write-Host "🔧 Fixing all TSX live blocks..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "docs/components" -Filter "*.md" -Recurse

$totalFixed = 0
$patterns = @(
    # Fix double-spaced style objects: { { -> {{
    @{ Pattern = '\{\s+\{'; Replacement = '{{' },
    # Fix spaced interpolation endings: } } -> }}
    @{ Pattern = '\}\s+\}'; Replacement = '}}' },
    # Fix interpolation with trailing space before tags: { option} </span> -> {option}</span>
    @{ Pattern = '\{\s*(\w+)\}\s+<'; Replacement = '{$1}<' },
    # Fix interpolation with leading space: { option -> {option
    @{ Pattern = '\{\s+(\w+)'; Replacement = '{$1' },
    # Fix interpolation with trailing space: option } -> option}
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
        Write-Host "✅ Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n🎉 Fixed $totalFixed files!" -ForegroundColor Green
Write-Host "Next: npm run docs build" -ForegroundColor Yellow
