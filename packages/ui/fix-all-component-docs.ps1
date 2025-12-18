# Global Fix for Component Documentation JSX Syntax Issues
# Removes problematic JSX code blocks that break VitePress Vue parser

Write-Host ""
Write-Host "Starting Global Component Docs Fix..." -ForegroundColor Cyan
Write-Host ""

$docsPath = "docs/components"
$files = Get-ChildItem -Path $docsPath -Filter "*.md" -Recurse
$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Fix malformed backticks: `javascript\n to ```typescript
    $content = $content -replace '`javascript\\n', '```typescript'
    $content = $content -replace '`javascript\n', '```typescript'
    $content = $content -replace '``typescript', '```typescript'
    $content = $content -replace '````typescript<', '```typescript
<'
    $content = $content -replace '```typescript<', '```typescript
<'
    
    # Remove JSX blocks with {{ syntax
    $content = $content -replace '(?s)```(?:javascript|jsx)\s*\nexport default function[^`]*?\{\{[^`]*?```', ''
    
    # Fix CSS double braces
    $content = $content -replace '\.custom-\w+\s*\{\{', '.custom-class {'
    $content = $content -replace '\s*\}\}\s*\n```', '  }`n```'
    
    # Fix import statements
    $content = $content -replace 'import \{\{(\w+)\}\}', 'import { $1 }'
    $content = $content -replace 'function (\w+)\(\) \{\{', 'function $1() {'
    
    # Remove inline style={{ lines
    $content = $content -replace '(?m)^\s*style=\{\{.*$\n?', ''
    $content = $content -replace '(?m)^\s*\w+=\{\{.*$\n?', ''
    
    # Fix broken code blocks: ```<Component
    $content = $content -replace '```<Z\w+[^`]*?/>', ''
    $content = $content -replace '```<Z[^>]*>[^<]*</Z[^>]*>', ''
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host ""
Write-Host "Summary: Fixed $fixedCount files out of $($files.Count) total" -ForegroundColor Cyan
Write-Host ""
