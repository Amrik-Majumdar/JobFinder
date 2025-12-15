// API client for backend communication
// All API keys are handled server-side

const API_BASE_URL = (import.meta.env as any).VITE_API_BASE_URL || '/api'

export interface AnalyzeResumeResponse {
  skills: {
    hardSkills: string[]
    softSkills: string[]
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
    industryAlignment: string[]
    yearsOfExperience?: number
  }
}

export interface SearchJobsResponse {
  jobs: Array<{
    title: string
    company: string
    location: string
    link: string
    description: string
    jobType?: string
    salary?: string
  }>
}

export async function analyzeResume(file: File): Promise<AnalyzeResumeResponse> {
  const formData = new FormData()
  formData.append('resume', file)

  const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to analyze resume' }))
    throw new Error(error.message || 'Failed to analyze resume')
  }

  return response.json()
}

export async function searchJobs(params: {
  skills: string[]
  field: string
  education: string
  age: number
  preference: string
  location?: string
}): Promise<SearchJobsResponse> {
  const response = await fetch(`${API_BASE_URL}/search-jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to search jobs' }))
    throw new Error(error.message || 'Failed to search jobs')
  }

  return response.json()
}

export async function matchJobs(params: {
  jobs: SearchJobsResponse['jobs']
  skills: AnalyzeResumeResponse['skills']
  userProfile: {
    age: number
    education: string
    field: string
    preference: string
  }
}): Promise<Array<{
  title: string
  company: string
  location: string
  link: string
  description: string
  matchScore: number
  matchedSkills: string[]
  jobType?: string
  salary?: string
}>> {
  const response = await fetch(`${API_BASE_URL}/match-jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to match jobs' }))
    throw new Error(error.message || 'Failed to match jobs')
  }

  return response.json()
}

