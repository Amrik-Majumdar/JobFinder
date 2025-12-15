# API Keys Setup Guide

Your API keys have been configured for local development. Here's how to set them up for production:

## ✅ Local Development

The API keys are already set in `.env.local` for local development. When you run `vercel dev`, these will be used automatically.

## 🚀 Production Setup (Vercel)

### Option 1: Using Vercel CLI

1. **Set SERP API Key**
   ```bash
   vercel env add SERP_API_KEY production
   ```
   When prompted, paste: `77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366`

2. **Set Cerebras API Key**
   ```bash
   vercel env add CEREBRAS_API_KEY production
   ```
   When prompted, paste: `csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp`

3. **Redeploy to apply changes**
   ```bash
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following:

   **SERP_API_KEY**
   - Value: `77c0580909741a5b0777a1b78332ee9836eba0894d0e53e08ced641f378da366`
   - Environment: Production, Preview, Development

   **CEREBRAS_API_KEY**
   - Value: `csk-xmdt2jwj434268fdjdjv39t8c33fnv4jynjt5e356f5dhmjp`
   - Environment: Production, Preview, Development

5. **Redeploy** your project for changes to take effect

## 🔒 Security Notes

- ✅ `.env.local` is already in `.gitignore` - your keys won't be committed
- ✅ Never commit API keys to git
- ✅ Never share API keys publicly
- ✅ Rotate keys if they're accidentally exposed
- ✅ Use different keys for development and production if possible

## 🧪 Testing

After setting up the keys:

1. **Test locally**:
   ```bash
   vercel dev
   npm run dev
   ```

2. **Test production**:
   - Deploy to Vercel
   - Test the resume upload and job search features
   - Check Vercel function logs if issues occur

## 📝 Quick Reference

- **SERP API**: Used for real-time job search
- **Cerebras API**: Used for AI-powered resume analysis

Both APIs are now configured and ready to use!

