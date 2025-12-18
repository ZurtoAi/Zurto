# Fix all index.md files by removing problematic inline component examples
Write-Host "Fixing index.md files..." -ForegroundColor Cyan

$indexFiles = Get-ChildItem -Path "docs\components" -Filter "index.md" -Recurse

foreach ($file in $indexFiles) {
    Write-Host "Processing: $($file.FullName)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove lines with incomplete component tags followed by /></div>
    $content = $content -replace '(?m)^.*</div>\n', ''
    
    # Remove any remaining broken JSX-style component tags
    $content = $content -replace '<Z[A-Z][a-zA-Z]*[^>]*\s*/>', ''
    
    # Remove broken code blocks that start with ```<
    $content = $content -replace '(?s)```<[^`]*```', ''
    
    # Remove any orphaned line with just closing tags
    $content = $content -replace '(?m)^\s*</[^>]+>\s*$\n', ''
    
    # Remove empty lines that might be left behind (more than 2 consecutive)
    $content = $content -replace '(?m)^\s*$\n^\s*$\n^\s*$\n', "`n`n"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "   Fixed" -ForegroundColor Green
    } else {
        Write-Host "  - No changes needed" -ForegroundColor Gray
    }
}

Write-Host "`nDone! All index.md files processed." -ForegroundColor Green
