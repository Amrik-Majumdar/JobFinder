# AI Job Finder

A production-ready AI-powered job discovery platform that matches users with jobs based on their resume, skills, education, and preferences.

## 🚀 Features

- **Multi-step Wizard**: Intuitive step-by-step form to collect user information
- **Resume Analysis**: AI-powered resume parsing and skill extraction using Cerebras LLM
- **Real-time Job Search**: Integration with SERP API for live job listings
- **Smart Matching**: Advanced algorithm that matches jobs based on:
  - Resume-derived skills (hard & soft skills)
  - Education level
  - Age and experience
  - Desired field/industry
  - Work preferences (remote/hybrid/on-site)
- **Modern UI**: Premium, polished interface with smooth animations and responsive design
- **Job Filtering & Sorting**: Filter by location, job type, and sort by relevance

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom animations
- **Routing**: React Router
- **Animations**: Framer Motion
- **Deployment**: GitHub Pages (100% static)

### Backend
- **Platform**: Vercel Serverless Functions
- **APIs Used**:
  - SERP API for job search
  - Cerebras LLM for resume analysis
- **Security**: All API keys stored server-side only

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── wizard/          # Multi-step wizard components
│   │   ├── Wizard.tsx       # Main wizard container
│   │   ├── JobResults.tsx   # Job results page
│   │   ├── JobCard.tsx      # Individual job card
│   │   └── ...
│   ├── api/
│   │   └── client.ts        # API client (no keys exposed)
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── api/
│   ├── analyze-resume.ts    # Resume parsing & LLM analysis
│   ├── search-jobs.ts       # SERP API job search
│   └── match-jobs.ts        # Job matching algorithm
├── vercel.json              # Vercel configuration
└── package.json
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Vercel CLI (for backend testing)
- API Keys:
  - SERP API key (from [serpapi.com](https://serpapi.com))
  - Cerebras API key (from [cerebras.ai](https://cerebras.ai))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Joby
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

   For Vercel backend (create `.env` in root for Vercel):
   ```env
   SERP_API_KEY=your_serp_api_key
   CEREBRAS_API_KEY=your_cerebras_api_key
   ```

4. **Run frontend development server**
   ```bash
   npm run dev
   ```

5. **Run backend locally (optional)**
   ```bash
   vercel dev
   ```

   Or deploy to Vercel:
   ```bash
   vercel
   ```

## 🚀 Deployment

### Frontend (GitHub Pages)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Configure GitHub Pages**
   - Go to your repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (or `main` with `/docs` folder)
   - Folder: `/root` or `/docs` (depending on your setup)

3. **Deploy using GitHub Actions** (recommended)
   - The included `.github/workflows/deploy.yml` will automatically deploy on push to `main`
   - Or manually push the `dist` folder to `gh-pages` branch

4. **Update API base URL**
   - After deploying, update `VITE_API_BASE_URL` in your build to point to your Vercel backend
   - Or set it in GitHub Pages environment variables if supported

### Backend (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables**
   ```bash
   vercel env add SERP_API_KEY
   vercel env add CEREBRAS_API_KEY
   ```

4. **Update frontend API URL**
   - After deployment, update `VITE_API_BASE_URL` to your Vercel deployment URL
   - Example: `https://your-project.vercel.app/api`

## 🔧 Configuration

### API Base URL

The frontend uses `VITE_API_BASE_URL` environment variable. For production:

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-vercel-app.vercel.app/api`

### Resume Parsing

The backend supports PDF and DOCX files. For production, install:
```bash
npm install pdf-parse mammoth
```

### Rate Limiting

Consider adding rate limiting to your Vercel functions to prevent abuse. You can use:
- Vercel's built-in rate limiting
- Upstash Redis for distributed rate limiting

## 📝 API Endpoints

### POST `/api/analyze-resume`
Analyzes a resume file and extracts skills using LLM.

**Request**: FormData with `resume` file
**Response**:
```json
{
  "skills": {
    "hardSkills": ["JavaScript", "React", ...],
    "softSkills": ["Leadership", "Communication", ...],
    "experienceLevel": "mid",
    "industryAlignment": ["tech", "software"],
    "yearsOfExperience": 5
  }
}
```

### POST `/api/search-jobs`
Searches for jobs using SERP API.

**Request**:
```json
{
  "skills": ["JavaScript", "React"],
  "field": "tech",
  "education": "bachelors",
  "age": 25,
  "preference": "remote",
  "location": "San Francisco, CA"
}
```

**Response**:
```json
{
  "jobs": [
    {
      "title": "Software Engineer",
      "company": "TechCorp",
      "location": "San Francisco, CA",
      "link": "https://...",
      "description": "...",
      "jobType": "Full-time",
      "salary": "$100k - $150k"
    }
  ]
}
```

### POST `/api/match-jobs`
Matches jobs with user profile and calculates relevance scores.

**Request**:
```json
{
  "jobs": [...],
  "skills": {...},
  "userProfile": {...}
}
```

**Response**: Array of jobs with `matchScore` and `matchedSkills` added.

## 🎨 UI/UX Features

- **Glassmorphism**: Modern glass-effect cards
- **Smooth Animations**: Framer Motion for transitions
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: Semantic HTML and ARIA labels

## 🔒 Security

- ✅ No API keys in frontend code
- ✅ All sensitive operations on backend
- ✅ Input validation and sanitization
- ✅ File size limits (10MB for resumes)
- ✅ CORS configured properly

## 📦 Dependencies

### Frontend
- `react` & `react-dom`: UI framework
- `react-router-dom`: Routing
- `framer-motion`: Animations
- `tailwindcss`: Styling
- `lucide-react`: Icons
- `react-dropzone`: File uploads

### Backend
- `@vercel/node`: Vercel serverless runtime
- `formidable`: File upload parsing
- `pdf-parse`: PDF text extraction (install for production)
- `mammoth`: DOCX text extraction (install for production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🐛 Troubleshooting

### Resume parsing not working
- Ensure `pdf-parse` and `mammoth` are installed
- Check file size limits (max 10MB)
- Verify file format (PDF or DOCX)

### API calls failing
- Check API keys are set in Vercel environment variables
- Verify CORS settings
- Check network tab for error details

### Build errors
- Clear `node_modules` and reinstall
- Check Node.js version (18+ required)
- Verify all environment variables are set

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React, Vite, Tailwind CSS, and Vercel.

