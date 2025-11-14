# Quick Start Script for Arc Raiders Bounty Hunter
# Run this script to check if everything is set up correctly

Write-Host "🎮 Arc Raiders Bounty Hunter - Setup Verification" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "1. Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
Write-Host ""
Write-Host "2. Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
    
    # Check if values are configured
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "your_project_url_here" -or $envContent -match "your_anon_key_here") {
        Write-Host "   ⚠️  WARNING: .env file contains placeholder values" -ForegroundColor Yellow
        Write-Host "   Please update .env with your actual Supabase credentials" -ForegroundColor Yellow
        Write-Host "   See SUPABASE_SETUP.md for instructions" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Environment variables configured" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ .env file not found" -ForegroundColor Red
    Write-Host "   Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "   ✅ .env file created. Please update it with your Supabase credentials" -ForegroundColor Green
}

# Check if node_modules exists
Write-Host ""
Write-Host "3. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Running: npm install" -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Summary
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "📋 Setup Summary" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Follow SUPABASE_SETUP.md to create your Supabase project" -ForegroundColor White
Write-Host "2. Update .env file with your Supabase credentials" -ForegroundColor White
Write-Host "3. Run the database migrations in Supabase SQL Editor" -ForegroundColor White
Write-Host "4. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - Setup Guide: SUPABASE_SETUP.md" -ForegroundColor White
Write-Host "   - Project README: README.md" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
