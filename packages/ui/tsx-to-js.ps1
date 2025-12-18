# Convert TSX to JS to avoid Vue parser issues
Write-Host "Converting tsx blocks to js..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "docs/components" -Filter "*.md" -Recurse
$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Replace ```tsx with ```javascript
    $content = $content -replace '```tsx', '```javascript'
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalFixed++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nConverted $totalFixed files!" -ForegroundColor Green
