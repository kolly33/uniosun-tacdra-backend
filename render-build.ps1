# PowerShell build script for UNIOSUN TACDRA Backend (Windows)
# This is for local testing - Render will use the .sh version

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting build for UNIOSUN TACDRA..." -ForegroundColor Green

# Print environment info
Write-Host "📊 Environment Information:" -ForegroundColor Cyan
Write-Host "Node.js version: $(node --version)"
Write-Host "NPM version: $(npm --version)"
Write-Host "NODE_ENV: $($env:NODE_ENV ?? 'development')"
Write-Host "Platform: Windows"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "🔨 Building NestJS application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Verify build output
if (Test-Path "dist") {
    Write-Host "✅ Build successful - dist directory created" -ForegroundColor Green
    Write-Host "📁 Build contents:" -ForegroundColor Cyan
    Get-ChildItem -Path "dist" -Recurse | Format-Table Name, Length, LastWriteTime
} else {
    Write-Host "❌ Build failed - dist directory not found" -ForegroundColor Red
    exit 1
}

# Create uploads directory if it doesn't exist
Write-Host "📁 Setting up uploads directory..." -ForegroundColor Yellow
if (-not (Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads" -Force
}
"Ready for file uploads" | Out-File -FilePath "uploads\.gitkeep" -Encoding UTF8

# Verify critical files
Write-Host "🔍 Verifying critical files..." -ForegroundColor Cyan
if (Test-Path "dist\main.js") {
    Write-Host "✅ Main application file found" -ForegroundColor Green
} else {
    Write-Host "❌ Main application file missing" -ForegroundColor Red
    exit 1
}

if (Test-Path "package.json") {
    Write-Host "✅ Package.json found" -ForegroundColor Green
} else {
    Write-Host "❌ Package.json missing" -ForegroundColor Red
    exit 1
}

# Print final status
Write-Host "📊 Final Build Summary:" -ForegroundColor Cyan
$distFiles = Get-ChildItem -Path "dist" -Recurse -File
Write-Host "Total files in dist: $($distFiles.Count)"
Write-Host "Upload directory: $(if (Test-Path 'uploads') { 'Ready' } else { 'Missing' })"
$distSize = [math]::Round(($distFiles | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
Write-Host "Build size: ${distSize} MB"

Write-Host "✅ Build completed successfully! Ready for production deployment." -ForegroundColor Green
