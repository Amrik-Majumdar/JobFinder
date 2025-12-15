# Deploy to Vercel - Step by Step

Since the project name must be lowercase, follow these steps:

1. **Run the deployment command:**
   ```bash
   vercel
   ```

2. **When prompted, answer:**
   - Set up and deploy? **yes**
   - Which scope? **Select your account**
   - Link to existing project? **no**
   - What's your project's name? **joby** (lowercase!)
   - In which directory is your code located? **./**
   - Want to modify these settings? **no**
   - Do you want to change additional project settings? **no**

3. **After deployment, set up API keys:**
   ```bash
   npm run setup:vercel
   ```

4. **Redeploy with production environment:**
   ```bash
   vercel --prod
   ```

**Important:** Use **"joby"** (all lowercase) as the project name, not "Joby"!

