# Deploy zurto-ui Documentation to Docker
# This script builds and deploys the documentation website

Write-Host "[DEPLOY] Deploying zurto-ui Documentation to Docker..." -ForegroundColor Cyan
Write-Host ""

# Navigate to zurto-ui directory
Set-Location "c:\Users\leogr\Desktop\Workspace\zurto-ui"

# Step 1: Build documentation locally first
Write-Host "[BUILD] Building documentation..." -ForegroundColor Yellow
npm run docs:build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Documentation build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "[SUCCESS] Documentation built successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Stop existing container if running
Write-Host "[CLEANUP] Stopping existing container..." -ForegroundColor Yellow
docker compose -f docker-compose.docs.yml down 2>$null

Write-Host "[SUCCESS] Existing container stopped" -ForegroundColor Green
Write-Host ""

# Step 3: Build Docker image
Write-Host "[DOCKER] Building Docker image..." -ForegroundColor Yellow
docker compose -f docker-compose.docs.yml build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "[SUCCESS] Docker image built successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Start container
Write-Host "[START] Starting Docker container..." -ForegroundColor Yellow
docker compose -f docker-compose.docs.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to start container!" -ForegroundColor Red
    exit 1
}

Write-Host "[SUCCESS] Container started successfully" -ForegroundColor Green
Write-Host ""

# Step 5: Verify deployment
Write-Host "[VERIFY] Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

$response = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -UseBasicParsing -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "[SUCCESS] Documentation is live at http://localhost:8080" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Container started but health check failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[STATUS] Container Status:" -ForegroundColor Cyan
docker compose -f docker-compose.docs.yml ps

Write-Host ""
Write-Host "[COMPLETE] Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Useful commands:" -ForegroundColor Cyan
Write-Host "  - View logs:    docker compose -f docker-compose.docs.yml logs -f"
Write-Host "  - Stop:         docker compose -f docker-compose.docs.yml down"
Write-Host "  - Restart:      docker compose -f docker-compose.docs.yml restart"
Write-Host "  - View site:    http://localhost:8080"
Write-Host ""
