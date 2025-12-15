# Development Notes

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Update `VITE_API_BASE_URL` to point to your backend

3. **Run development server**
   ```bash
   npm run dev
   ```

## Important Notes

### API Dependencies

The backend API functions require additional packages for production resume parsing:

```bash
cd api
npm install pdf-parse mammoth
```

These are marked as optional dependencies, so the app will work without them but resume parsing will use a fallback keyword-based extraction.

### Vercel Deployment

When deploying to Vercel:
1. The `api/` folder will be automatically detected
2. Each `.ts` file becomes a serverless function
3. Environment variables must be set in Vercel dashboard

### GitHub Pages Routing

The app uses React Router with a `basename` of `/Joby`. If your repository has a different name:
1. Update `base` in `vite.config.ts`
2. Update `basename` in `src/App.tsx`
3. Update GitHub Pages base URL accordingly

### API Base URL

For local development:
- `VITE_API_BASE_URL=http://localhost:3000/api` (if using `vercel dev`)

For production:
- `VITE_API_BASE_URL=https://your-vercel-app.vercel.app/api`

### Mock Data

The backend includes mock job data for development/testing when API keys are not set. This allows you to test the frontend without setting up API accounts immediately.

## File Structure

```
├── api/                    # Serverless functions (Vercel)
│   ├── analyze-resume.ts   # Resume parsing & LLM analysis
│   ├── search-jobs.ts      # SERP API integration
│   └── match-jobs.ts       # Job matching algorithm
├── src/
│   ├── components/         # React components
│   ├── api/                # Frontend API client
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
└── dist/                   # Build output (GitHub Pages)
```

## Testing

1. **Frontend only** (with mock data):
   - Set `VITE_API_BASE_URL` to a non-existent URL
   - Backend will return mock data when API keys are missing

2. **Full stack**:
   - Deploy backend to Vercel
   - Set API keys in Vercel environment variables
   - Update `VITE_API_BASE_URL` to Vercel URL
   - Test resume upload and job search

## Common Issues

### CORS Errors
- Ensure `vercel.json` has correct CORS headers
- Check that frontend URL matches allowed origin

### Resume Upload Fails
- Check file size (max 10MB)
- Verify file format (PDF or DOCX)
- Ensure `formidable` is installed

### Jobs Not Loading
- Check SERP API key is set
- Verify API endpoint is accessible
- Check browser console for errors

### Build Fails
- Clear `node_modules` and reinstall
- Check Node.js version (18+)
- Verify all dependencies are installed

