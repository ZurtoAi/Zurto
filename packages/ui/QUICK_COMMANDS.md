# 🚀 Zurto UI 2.0 - Quick Commands

## 📦 NPM Package Publishing

```bash
# 1. Login to npm (one-time setup)
npm login

# 2. Build the package
cd c:\Users\leogr\Desktop\Workspace\zurto-ui
npm run build

# 3. Test the package locally
npm pack
# This creates zurto-ui-2.0.0.tgz

# 4. Test in another project (optional)
cd ..\test-project
npm install ..\zurto-ui\zurto-ui-2.0.0.tgz

# 5. Publish to npm registry
cd ..\zurto-ui
npm publish

# 6. Verify published version
npm view zurto-ui version
npm view zurto-ui
```

## 📚 Documentation Development

```powershell
# Start dev server
cd c:\Users\leogr\Desktop\Workspace\zurto-ui
npm run docs:dev
# Opens at http://localhost:5173 (or next available port)

# Generate component docs from examples
npm run docs:generate

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## 🎨 Creating Component Examples

### Single Component

```powershell
# 1. Create examples folder
New-Item -ItemType Directory -Force -Path "src\components\button\ZButton\examples"

# 2. Create example file
@"
export default function BasicExample() {
  return (
    <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
      <ZButton>Click Me</ZButton>
      <ZButton variant="secondary">Secondary</ZButton>
    </div>
  );
}
"@ | Out-File -FilePath "src\components\button\ZButton\examples\Basic.tsx" -Encoding utf8

# 3. Generate docs
npm run docs:generate
```

### Multiple Components (Bulk)

```powershell
# Use the helper script
.\create-examples.ps1

# Then generate all docs
npm run docs:generate
```

## 🌐 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy docs
cd docs
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy docs
cd docs
netlify deploy --prod --dir=.vitepress/dist
```

### GitHub Pages

```bash
# Build docs
npm run docs:build

# Push to gh-pages branch
git subtree push --prefix docs/.vitepress/dist origin gh-pages
```

### Custom Server (Direct)

```bash
# Build first
npm run docs:build

# Serve the dist folder
cd docs/.vitepress/dist
npx serve -s
```

## 🔍 Testing

### Check Auto-Preview Generation

```powershell
# Create test example
npm run docs:generate

# Check generated markdown files
Get-ChildItem docs\components -Recurse -Filter "*.md" | Select-Object Name, LastWriteTime | Sort-Object LastWriteTime -Descending | Select-Object -First 10
```

### Verify Package Contents

```powershell
# Build package
npm run build

# Check dist folder
Get-ChildItem dist -Recurse | Measure-Object | Select-Object Count

# List all files
Get-ChildItem dist -Recurse | Select-Object FullName
```

### Test Dev Server

```powershell
# Start server (background)
Start-Process powershell -ArgumentList "cd c:\Users\leogr\Desktop\Workspace\zurto-ui; npm run docs:dev" -NoNewWindow

# Check if running
Get-Process -Name node

# Open browser
Start-Process "http://localhost:5173"
```

## 📊 Component Statistics

```powershell
# Count total components
(Get-ChildItem src\components -Directory -Recurse | Where-Object { $_.Name -match '^Z[A-Z]' }).Count

# Count by category
Get-ChildItem src\components -Directory | ForEach-Object {
    $category = $_.Name
    $count = (Get-ChildItem $_.FullName -Directory | Where-Object { $_.Name -match '^Z[A-Z]' }).Count
    "$category`: $count components"
}

# Find components without examples
Get-ChildItem src\components -Directory -Recurse | Where-Object {
    $_.Name -match '^Z[A-Z]' -and -not (Test-Path (Join-Path $_.FullName "examples"))
} | Select-Object FullName
```

## 🔧 Maintenance Commands

### Update Dependencies

```bash
npm outdated
npm update
npm audit fix
```

### Clean Build

```powershell
# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force dist
Remove-Item package-lock.json
npm install
```

### Regenerate All Docs

```powershell
# Clean old docs
Remove-Item -Recurse -Force docs\components\*\*.md -Exclude index.md

# Regenerate
npm run docs:generate
```

## 📝 Git Workflow

```bash
# Check status
git status

# Stage all changes
git add .

# Commit with message
git commit -m "feat: Zurto UI 2.0 - Complete redesign with grid layout and auto-previews"

# Push to remote
git push origin main

# Create release tag
git tag -a v2.0.0 -m "Zurto UI 2.0 - Major redesign"
git push origin v2.0.0
```

## 🎯 Quick Workflow

### Daily Development

```powershell
# 1. Start dev server (in background)
cd c:\Users\leogr\Desktop\Workspace\zurto-ui
Start-Process powershell -ArgumentList "npm run docs:dev" -NoNewWindow

# 2. Create component examples as needed
# 3. Generate docs
npm run docs:generate

# 4. Commit changes
git add .
git commit -m "docs: Update component examples"
git push
```

### Releasing New Version

```bash
# 1. Update version in package.json
npm version patch  # or minor, or major

# 2. Build package
npm run build

# 3. Build docs
npm run docs:build

# 4. Publish package
npm publish

# 5. Deploy docs (choose method)
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod
# - GitHub Pages: git push origin gh-pages

# 6. Create git tag
git tag -a v2.0.1 -m "Release v2.0.1"
git push origin v2.0.1
```

## 🌐 URLs

- **Dev Server**: http://localhost:5173 (or 5174, 5175)
- **Production Docs**: https://ui.zurto.app
- **NPM Package**: https://npmjs.com/package/zurto-ui
- **GitHub Repo**: https://github.com/zurto/zurto-ui

## 📞 Support

- **Issues**: GitHub Issues
- **Discord**: #ui-library channel
- **Docs**: https://ui.zurto.app/guide/getting-started
- **Examples**: https://ui.zurto.app/components/

---

**Version**: 2.0.0  
**Last Updated**: December 18, 2025
