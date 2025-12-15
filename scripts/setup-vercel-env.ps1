# PowerShell script to set up Vercel environment variables
# Run this script after deploying to Vercel

Write-Host "🚀 Setting up Vercel Environment Variables..." -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
try {
    $null = Get-Command vercel -ErrorAction Stop
} catch {
    Write-Host "❌ Vercel CLI is not installed." -ForegroundColor Red
    Write-Host "Install it with: npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if logged in
try {
    $null = vercel whoami 2>&1
} catch {
    Write-Host "❌ Not logged in to Vercel." -ForegroundColor Red
    Write-Host "Login with: vercel login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Vercel CLI is ready" -ForegroundColor Green
Write-Host ""

# Set SERP API Key
Write-Host "Setting SERP_API_KEY..." -ForegroundColor Yellow
"77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366" | vercel env add SERP_API_KEY production
"77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366" | vercel env add SERP_API_KEY preview
"77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366" | vercel env add SERP_API_KEY development

# Set Cerebras API Key
Write-Host "Setting CEREBRAS_API_KEY..." -ForegroundColor Yellow
"csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp" | vercel env add CEREBRAS_API_KEY production
"csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp" | vercel env add CEREBRAS_API_KEY preview
"csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp" | vercel env add CEREBRAS_API_KEY development

Write-Host ""
Write-Host "✅ Environment variables set!" -ForegroundColor Green
Write-Host ""
Write-Host "Now redeploy with: vercel --prod" -ForegroundColor Cyan

