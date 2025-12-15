# Quick Start Guide

## ✅ API Keys Already Configured!

Your API keys have been set up. Here's what's ready:

### Local Development
- ✅ `.env.local` file created with your API keys
- ✅ Ready to use with `vercel dev`

### Next Steps to Deploy

1. **Install dependencies** (if not done already):
   ```bash
   npm install
   ```

2. **Deploy backend to Vercel**:
   ```bash
   # Install Vercel CLI (if needed)
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

3. **Set API keys in Vercel** (choose one method):

   **Method A: Use the setup script** (easiest):
   ```bash
   npm run setup:vercel
   ```
   
   **Method B: Manual CLI**:
   ```bash
   echo "77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366" | vercel env add SERP_API_KEY production
   echo "csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp" | vercel env add CEREBRAS_API_KEY production
   ```
   
   **Method C: Vercel Dashboard**:
   - Go to https://vercel.com/dashboard
   - Select your project → Settings → Environment Variables
   - Add both keys for Production, Preview, and Development

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

5. **Update frontend API URL**:
   - Note your Vercel URL (e.g., `https://your-project.vercel.app`)
   - Create `.env.production`:
     ```
     VITE_API_BASE_URL=https://your-project.vercel.app/api
     ```

6. **Deploy frontend to GitHub Pages**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
   - GitHub Actions will automatically deploy

## 🧪 Test Locally

```bash
# Terminal 1: Start backend
vercel dev

# Terminal 2: Start frontend
npm run dev
```

Visit http://localhost:5173 and test the app!

## 📝 Your API Keys

- **SERP API**: `77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366`
- **Cerebras API**: `csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp`

Both are configured and ready to use! 🚀

