# Fix JSX syntax issues in all markdown files
# Removes code blocks containing {{ syntax that breaks VitePress Vue parser

$docsPath = "docs/components"
$files = Get-ChildItem -Path $docsPath -Filter "*.md" -Recurse
$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove JSX code blocks that contain {{ syntax (Vue template conflict)
    # Pattern: ```jsx or ```javascript followed by lines with {{
    $content = $content -replace '(?s)```(?:jsx|javascript)\s*\n(?:.*?\{\{.*?\n)*.*?```\s*\n', ''
    
    # Also remove inline style={{ blocks
    $content = $content -replace '(?m)^.*?style=\{\{.*?\}\}.*$\n?', ''
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host "`nTotal files fixed: $fixedCount" -ForegroundColor Cyan
