#!/usr/bin/env node

/**
 * Node.js script to set up Vercel environment variables
 * Usage: node scripts/setup-vercel-env.js
 * 
 * Note: This script uses CommonJS for compatibility
 */

const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const API_KEYS = {
  SERP_API_KEY: '77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366',
  CEREBRAS_API_KEY: 'csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp',
};

const environments = ['production', 'preview', 'development'];

console.log('🚀 Setting up Vercel Environment Variables...\n');

// Check if vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Vercel CLI is not installed.');
  console.error('Install it with: npm i -g vercel');
  process.exit(1);
}

// Check if logged in
try {
  execSync('vercel whoami', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Not logged in to Vercel.');
  console.error('Login with: vercel login');
  process.exit(1);
}

console.log('✅ Vercel CLI is ready\n');

// Set environment variables
for (const [key, value] of Object.entries(API_KEYS)) {
  console.log(`Setting ${key}...`);
  for (const env of environments) {
    try {
      execSync(`echo "${value}" | vercel env add ${key} ${env}`, {
        stdio: 'pipe',
      });
      console.log(`  ✅ Set for ${env}`);
    } catch (error) {
      console.log(`  ⚠️  ${env} - may already exist or need manual setup`);
    }
  }
}

console.log('\n✅ Environment variables setup complete!');
console.log('\nNow redeploy with: vercel --prod');

