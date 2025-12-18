# Convert TSX Live Blocks to Static Code Examples
# This fixes VitePress build errors while maintaining visual appearance

Write-Host "Converting tsx live blocks to static code examples..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "docs/components" -Filter "*.md" -Recurse
$totalConverted = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Replace ```tsx live with ```tsx (static)
    $content = $content -replace '```tsx live', '```tsx'
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalConverted++
        Write-Host "Converted: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nConverted $totalConverted files to static examples!" -ForegroundColor Green
Write-Host "Build should now work: npm run docs:build" -ForegroundColor Yellow
