# Fix Markdown Formatting - Remove Extra Backtick Blocks
Write-Host "Fixing markdown formatting..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "docs/components" -Filter "*.md" -Recurse
$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Remove wrapping ```` blocks around ```tsx blocks
    # Pattern: ````\n```tsx -> ```tsx
    $content = $content -replace '````\s*\n\s*```tsx', '```tsx'
    # Pattern: ```\n```` -> ```
    $content = $content -replace '```\s*\n\s*````', '```'
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalFixed++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nFixed $totalFixed files!" -ForegroundColor Green
Write-Host "Now testing build..." -ForegroundColor Yellow
