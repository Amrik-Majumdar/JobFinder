# Enable GitHub Pages - Step by Step

## Quick Fix

1. **Go to your repository**: https://github.com/Amrik-Majumdar/JobFinder

2. **Click on "Settings"** (top menu)

3. **Click on "Pages"** (left sidebar)

4. **Under "Source"**, select:
   - **Source**: `GitHub Actions` (NOT "Deploy from a branch")
   
5. **Click "Save"**

6. **Go back to "Actions"** tab and re-run the failed workflow:
   - Click on the failed workflow run
   - Click "Re-run all jobs"

That's it! GitHub Pages will now be enabled and your site will deploy automatically.

## Alternative: Manual Enablement

If the above doesn't work:

1. Go to **Settings** → **Pages**
2. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/root` or `/ (root)`
3. Click **Save**
4. Wait a few minutes for the first deployment
5. Then switch back to **GitHub Actions** as the source

## Your Site URL

Once enabled, your site will be available at:
**https://amrik-majumdar.github.io/JobFinder/**

## Troubleshooting

- If you see "404" after enabling, wait 5-10 minutes for the first build to complete
- Check the "Actions" tab to see if the deployment is running
- Make sure the workflow file (`.github/workflows/deploy.yml`) exists and is correct

