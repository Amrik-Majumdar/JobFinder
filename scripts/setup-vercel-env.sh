#!/bin/bash

# Script to set up Vercel environment variables
# Run this script after deploying to Vercel

echo "🚀 Setting up Vercel Environment Variables..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "Install it with: npm i -g vercel"
    exit 1
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel."
    echo "Login with: vercel login"
    exit 1
fi

echo "✅ Vercel CLI is ready"
echo ""

# Set SERP API Key
echo "Setting SERP_API_KEY..."
echo "77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366" | vercel env add SERP_API_KEY production
echo "77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366" | vercel env add SERP_API_KEY preview
echo "77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366" | vercel env add SERP_API_KEY development

# Set Cerebras API Key
echo "Setting CEREBRAS_API_KEY..."
echo "csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp" | vercel env add CEREBRAS_API_KEY production
echo "csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp" | vercel env add CEREBRAS_API_KEY preview
echo "csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp" | vercel env add CEREBRAS_API_KEY development

echo ""
echo "✅ Environment variables set!"
echo ""
echo "Now redeploy with: vercel --prod"

