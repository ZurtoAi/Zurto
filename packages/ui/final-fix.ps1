# Final Fix - Wrap all code blocks in v-pre to prevent Vue parsing
Write-Host "Applying final v-pre fix..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "docs/components" -Filter "*.md" -Recurse
$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Wrap code blocks with markdown comment directive
    # Replace ```javascript with ```javascript{:v-pre}
    $content = $content -replace '```javascript\r?\n', "```javascript\n"
    
    # Actually, simpler: convert to plain text blocks
    $content = $content -replace '```javascript', '```txt'
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalFixed++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nFixed $totalFixed files!" -ForegroundColor Green
