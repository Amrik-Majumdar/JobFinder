# Deployment Guide

This guide walks you through deploying the AI Job Finder application to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- SERP API key ([get one here](https://serpapi.com))
- Cerebras API key ([get one here](https://cerebras.ai))

## Step 1: Deploy Backend to Vercel

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the backend**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? `ai-job-finder-api` (or your choice)
   - Directory? `./` (root)
   - Override settings? **No**

4. **Set environment variables**
   ```bash
   vercel env add SERP_API_KEY
   # Paste: 77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366
   
   vercel env add CEREBRAS_API_KEY
   # Paste: csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp
   ```
   
   **Important**: Make sure to add these for **production** environment:
   ```bash
   vercel env add SERP_API_KEY production
   vercel env add CEREBRAS_API_KEY production
   ```

5. **Redeploy to apply environment variables**
   ```bash
   vercel --prod
   ```

6. **Note your Vercel deployment URL**
   - It will be something like: `https://ai-job-finder-api.vercel.app`
   - Your API endpoints will be at: `https://ai-job-finder-api.vercel.app/api/*`

## Step 2: Configure Frontend

1. **Update API base URL**
   
   Create a `.env.production` file:
   ```env
   VITE_API_BASE_URL=https://your-vercel-app.vercel.app/api
   ```
   Replace `your-vercel-app` with your actual Vercel project name.

2. **Or set it in GitHub Secrets** (for GitHub Actions)
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add secret: `VITE_API_BASE_URL` = `https://your-vercel-app.vercel.app/api`

## Step 3: Deploy Frontend to GitHub Pages

### Option A: Using GitHub Actions (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/Joby.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repo → Settings → Pages
   - Source: **GitHub Actions**
   - Save

3. **The GitHub Action will automatically deploy**
   - Every push to `main` will trigger a deployment
   - Check the Actions tab to see deployment status

### Option B: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to gh-pages branch**
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

3. **Configure GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/root`

## Step 4: Update CORS Settings (if needed)

If you encounter CORS errors, update `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://yourusername.github.io"
        }
      ]
    }
  ]
}
```

Then redeploy:
```bash
vercel --prod
```

## Step 5: Install Optional Dependencies (for Production)

For production resume parsing, install these in your Vercel project:

1. **Add to `api/package.json`** (already included as optional):
   ```json
   {
     "dependencies": {
       "pdf-parse": "^1.1.1",
       "mammoth": "^1.6.0"
     }
   }
   ```

2. **Install and redeploy**
   ```bash
   cd api
   npm install
   cd ..
   vercel --prod
   ```

## Troubleshooting

### Frontend can't reach backend
- Check `VITE_API_BASE_URL` is set correctly
- Verify Vercel deployment is live
- Check browser console for CORS errors

### Resume parsing not working
- Ensure `pdf-parse` and `mammoth` are installed
- Check file size limits (10MB max)
- Verify API keys are set in Vercel

### GitHub Pages shows 404
- Ensure `base` in `vite.config.ts` matches your repo name
- Check that `404.html` is in the `dist` folder
- Verify GitHub Pages is configured correctly

### API returns errors
- Check Vercel function logs: `vercel logs`
- Verify environment variables are set
- Check API key validity

## Testing Production

1. Visit your GitHub Pages URL
2. Complete the wizard form
3. Upload a resume (optional)
4. Verify jobs are returned
5. Check that matching scores appear

## Monitoring

- **Vercel Dashboard**: Monitor function invocations and errors
- **GitHub Actions**: Check deployment status
- **Browser Console**: Check for frontend errors

## Cost Estimates

- **GitHub Pages**: Free
- **Vercel**: Free tier includes:
  - 100GB bandwidth/month
  - 100 serverless function executions/day
- **SERP API**: Free tier available (limited requests)
- **Cerebras**: Check their pricing

For production scale, consider upgrading API plans as needed.

