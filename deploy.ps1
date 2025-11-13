# PowerShell deployment script for Windows
$ErrorActionPreference = "Stop"

Write-Host "Starting deployment process..." -ForegroundColor Cyan

# Step 1: Start PostgreSQL
Write-Host ""
Write-Host "Step 1: Starting PostgreSQL database..." -ForegroundColor Yellow
docker-compose up -d postgres

# Step 2: Wait for PostgreSQL to be healthy
Write-Host ""
Write-Host "Step 2: Waiting for PostgreSQL to be healthy..." -ForegroundColor Yellow
Write-Host "   This may take up to 30 seconds..."

$counter = 0
$maxAttempts = 30
$isHealthy = $false

while ($counter -lt $maxAttempts) {
    $status = docker-compose ps postgres | Select-String "healthy"
    if ($status) {
        Write-Host "PostgreSQL is healthy!" -ForegroundColor Green
        $isHealthy = $true
        break
    }

    $counter++
    Write-Host "   Attempt $counter/$maxAttempts..."
    Start-Sleep -Seconds 2
}

if (-not $isHealthy) {
    Write-Host "PostgreSQL failed to become healthy after $maxAttempts attempts" -ForegroundColor Red
    Write-Host "   Check logs with: docker-compose logs postgres"
    exit 1
}

# Step 3: Run database migrations and seed
Write-Host ""
Write-Host "Step 3: Running database migrations and seed..." -ForegroundColor Yellow
Write-Host "   Running Prisma migrations..."
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "Database migration failed" -ForegroundColor Red
    exit 1
}

Write-Host "   Seeding database..."
npx prisma db seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Database seeding failed (continuing anyway)" -ForegroundColor Yellow
}

# Step 4: Build the Next.js application
Write-Host ""
Write-Host "Step 4: Building Next.js application..." -ForegroundColor Yellow
Write-Host "   (This will prerender pages using the database)"
docker-compose build bakeshop

# Step 5: Start all services
Write-Host ""
Write-Host "Step 5: Starting all services..." -ForegroundColor Yellow
docker-compose up -d

# Step 6: Show status
Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "Application should be available at:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000"
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs:       docker-compose logs -f"
Write-Host "   Stop services:   docker-compose down"
Write-Host "   View status:     docker-compose ps"
