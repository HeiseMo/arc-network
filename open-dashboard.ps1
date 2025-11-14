# Helper script to open necessary URLs for setup
# Run this after creating your Supabase project

Write-Host "🔗 Opening Supabase Dashboard Links..." -ForegroundColor Cyan
Write-Host ""

# Ask if user has a project
$hasProject = Read-Host "Have you already created a Supabase project? (y/n)"

if ($hasProject -eq 'n' -or $hasProject -eq 'N') {
    Write-Host "Opening Supabase signup page..." -ForegroundColor Yellow
    Start-Process "https://supabase.com/dashboard"
    Write-Host "✅ Create your project, then run this script again!" -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "Great! Opening useful dashboard pages..." -ForegroundColor Green
Write-Host ""

# Ask for project URL
Write-Host "What is your Supabase project URL?" -ForegroundColor Yellow
Write-Host "Example: https://abcdefgh.supabase.co" -ForegroundColor DarkGray
$projectUrl = Read-Host "Project URL"

if ($projectUrl) {
    # Extract project ID
    if ($projectUrl -match '([a-z0-9]+)\.supabase\.co') {
        $projectId = $Matches[1]
        
        Write-Host ""
        Write-Host "Opening dashboard pages for project: $projectId" -ForegroundColor Cyan
        Write-Host ""
        
        # Open API settings to get credentials
        Write-Host "1. Opening API Settings (to get your credentials)..." -ForegroundColor Yellow
        Start-Process "https://supabase.com/dashboard/project/$projectId/settings/api"
        Start-Sleep -Seconds 1
        
        # Open SQL Editor
        Write-Host "2. Opening SQL Editor (to run migrations)..." -ForegroundColor Yellow
        Start-Process "https://supabase.com/dashboard/project/$projectId/sql/new"
        Start-Sleep -Seconds 1
        
        # Open Table Editor
        Write-Host "3. Opening Table Editor (to verify tables)..." -ForegroundColor Yellow
        Start-Process "https://supabase.com/dashboard/project/$projectId/editor"
        Start-Sleep -Seconds 1
        
        # Open Storage
        Write-Host "4. Opening Storage (to verify bucket)..." -ForegroundColor Yellow
        Start-Process "https://supabase.com/dashboard/project/$projectId/storage/buckets"
        Start-Sleep -Seconds 1
        
        # Open Authentication
        Write-Host "5. Opening Authentication Settings..." -ForegroundColor Yellow
        Start-Process "https://supabase.com/dashboard/project/$projectId/auth/providers"
        
        Write-Host ""
        Write-Host "=================================================" -ForegroundColor Cyan
        Write-Host "📋 Next Steps:" -ForegroundColor Yellow
        Write-Host "=================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. In API Settings: Copy your Project URL and anon key" -ForegroundColor White
        Write-Host "2. Update your .env file with these credentials" -ForegroundColor White
        Write-Host "3. In SQL Editor: Run both migration files from supabase/migrations/" -ForegroundColor White
        Write-Host "4. In Table Editor: Verify all tables were created" -ForegroundColor White
        Write-Host "5. In Storage: Verify bounty-proofs bucket exists" -ForegroundColor White
        Write-Host "6. In Authentication: Verify Email provider is enabled" -ForegroundColor White
        Write-Host ""
        Write-Host "📚 See SUPABASE_SETUP.md for detailed instructions" -ForegroundColor Cyan
        Write-Host ""
        
    } else {
        Write-Host "❌ Invalid project URL format" -ForegroundColor Red
        Write-Host "Expected format: https://xxxxx.supabase.co" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ No project URL provided" -ForegroundColor Red
}
