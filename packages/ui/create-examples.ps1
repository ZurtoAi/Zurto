# Create Example Files for Components
# Run this to quickly scaffold example folders

$components = @(
  'ZButton',
  'ZInput',
  'ZCard',
  'ZSelect',
  'ZCheckbox',
  'ZRadio',
  'ZSwitch',
  'ZTextarea',
  'ZModal',
  'ZAlert'
)

Write-Host "📦 Creating example files for components..." -ForegroundColor Cyan

foreach ($comp in $components) {
  $basePath = "src\components"
  
  # Find component directory (might be in subdirectory)
  $compDirs = Get-ChildItem -Path $basePath -Recurse -Directory -Filter $comp -ErrorAction SilentlyContinue
  
  if ($compDirs) {
    foreach ($compDir in $compDirs) {
      $examplesPath = Join-Path $compDir.FullName "examples"
      New-Item -ItemType Directory -Force -Path $examplesPath | Out-Null
      
      # Basic example
      $basicContent = @"
export default function BasicExample() {
  return (
    <div style={{ padding: '20px' }}>
      <$comp>Example Content</$comp>
    </div>
  );
}
"@
      Set-Content -Path (Join-Path $examplesPath "Basic.tsx") -Value $basicContent
      
      Write-Host "✅ Created examples for $comp at $($compDir.FullName)" -ForegroundColor Green
    }
  } else {
    Write-Host "⚠️  Could not find component: $comp" -ForegroundColor Yellow
  }
}

Write-Host "`n🎉 Done! Now run:" -ForegroundColor Green
Write-Host "   npm run docs:generate" -ForegroundColor Cyan
Write-Host "   npm run docs:dev" -ForegroundColor Cyan
