import type { VercelRequest, VercelResponse } from '@vercel/node'

interface Job {
  title: string
  company: string
  location: string
  link: string
  description: string
  jobType?: string
  salary?: string
}

interface ResumeSkills {
  hardSkills: string[]
  softSkills: string[]
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
  industryAlignment: string[]
  yearsOfExperience?: number
}

interface UserProfile {
  age: number
  education: string
  field: string
  preference: string
}

interface MatchedJob extends Job {
  matchScore: number
  matchedSkills: string[]
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://amrik-majumdar.github.io')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', 'https://amrik-majumdar.github.io')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { jobs, skills, userProfile } = req.body as {
      jobs: Job[]
      skills: ResumeSkills
      userProfile: UserProfile
    }

    if (!jobs || !skills || !userProfile) {
      return res.status(400).json({ message: 'Missing required parameters' })
    }

    // Match jobs with user profile
    const matchedJobs: MatchedJob[] = jobs.map((job) => {
      const matchResult = calculateMatchScore(job, skills, userProfile)
      return {
        ...job,
        matchScore: matchResult.score,
        matchedSkills: matchResult.matchedSkills,
      }
    })

    // Sort by match score (highest first)
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore)

    return res.status(200).json(matchedJobs)
  } catch (error: any) {
    console.error('Error matching jobs:', error)
    return res.status(500).json({
      message: 'Failed to match jobs',
      error: error.message,
    })
  }
}

function calculateMatchScore(
  job: Job,
  skills: ResumeSkills,
  userProfile: UserProfile
): { score: number; matchedSkills: string[] } {
  let score = 0
  const matchedSkills: string[] = []

  const allSkills = [...skills.hardSkills, ...skills.softSkills]
  const jobText = `${job.title} ${job.description} ${job.company}`.toLowerCase()

  // Skill matching (40% weight)
  const skillMatches = allSkills.filter((skill) =>
    jobText.includes(skill.toLowerCase())
  )
  matchedSkills.push(...skillMatches)
  const skillScore = (skillMatches.length / Math.max(allSkills.length, 1)) * 40
  score += skillScore

  // Field matching (20% weight)
  const fieldKeywords: Record<string, string[]> = {
    tech: ['software', 'developer', 'programmer', 'engineer', 'tech', 'it', 'coding'],
    healthcare: ['healthcare', 'medical', 'nurse', 'doctor', 'hospital', 'clinic'],
    business: ['business', 'management', 'analyst', 'consultant', 'strategy'],
    arts: ['design', 'creative', 'art', 'graphic', 'visual', 'artist'],
    trades: ['electrician', 'plumber', 'carpenter', 'technician', 'trade'],
    education: ['teacher', 'education', 'school', 'teaching', 'curriculum'],
    finance: ['finance', 'financial', 'accounting', 'accountant', 'banking'],
    marketing: ['marketing', 'advertising', 'brand', 'campaign', 'social media'],
    engineering: ['engineer', 'engineering', 'mechanical', 'electrical', 'civil'],
    sales: ['sales', 'account executive', 'business development', 'revenue'],
  }

  const fieldKeywordsList = fieldKeywords[userProfile.field] || []
  const fieldMatch = fieldKeywordsList.some((keyword) =>
    jobText.includes(keyword)
  )
  if (fieldMatch) {
    score += 20
  }

  // Work preference matching (15% weight)
  if (userProfile.preference === 'remote' && jobText.includes('remote')) {
    score += 15
  } else if (userProfile.preference === 'hybrid' && jobText.includes('hybrid')) {
    score += 15
  } else if (userProfile.preference === 'on-site' && !jobText.includes('remote')) {
    score += 10
  }

  // Location matching (10% weight)
  if (userProfile.preference !== 'remote' && userProfile.field) {
    // If user specified a location preference, check if job matches
    // This is simplified - in production, you'd use geocoding
    if (job.location.toLowerCase().includes(userProfile.field.toLowerCase())) {
      score += 10
    }
  }

  // Education level matching (10% weight)
  const educationKeywords: Record<string, string[]> = {
    'middle-school': ['entry', 'junior', 'beginner'],
    'high-school-student': ['entry', 'intern', 'student'],
    'high-school-graduate': ['entry', 'associate', 'high school'],
    bachelors: ['bachelor', 'degree', 'college'],
    masters: ['master', 'graduate', 'mba'],
    doctorate: ['phd', 'doctorate', 'doctoral', 'research'],
  }

  const eduKeywords = educationKeywords[userProfile.education] || []
  const eduMatch = eduKeywords.some((keyword) => jobText.includes(keyword))
  if (eduMatch) {
    score += 10
  }

  // Experience level matching (5% weight)
  const experienceKeywords: Record<string, string[]> = {
    entry: ['entry', 'junior', 'associate', 'intern', 'trainee'],
    mid: ['mid', 'intermediate', 'experienced'],
    senior: ['senior', 'lead', 'principal', 'expert'],
    executive: ['manager', 'director', 'vp', 'executive', 'chief'],
  }

  const expKeywords = experienceKeywords[skills.experienceLevel] || []
  const expMatch = expKeywords.some((keyword) => jobText.includes(keyword))
  if (expMatch) {
    score += 5
  }

  // Normalize score to 0-100
  score = Math.min(100, Math.max(0, Math.round(score)))

  return { score, matchedSkills: matchedSkills.slice(0, 10) }
}

