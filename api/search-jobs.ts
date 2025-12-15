import type { VercelRequest, VercelResponse } from '@vercel/node'

interface JobSearchParams {
  skills: string[]
  field: string
  education: string
  age: number
  preference: string
  location?: string
}

interface SerpJob {
  title: string
  company_name: string
  location: string
  link: string
  description?: string
  job_type?: string
  salary?: string
}

interface SerpApiResponse {
  jobs_results?: SerpJob[]
  error?: string
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const params: JobSearchParams = req.body

    if (!params.skills || !params.field || !params.education) {
      return res.status(400).json({ message: 'Missing required parameters' })
    }

    const serpApiKey = process.env.SERP_API_KEY
    if (!serpApiKey) {
      // Return mock data for development
      return res.status(200).json({
        jobs: generateMockJobs(params),
      })
    }

    // Build search query
    const query = buildSearchQuery(params)
    const location = params.location || 'United States'

    // Call SERP API
    const serpUrl = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&api_key=${serpApiKey}`

    const serpResponse = await fetch(serpUrl)
    const serpData: SerpApiResponse = await serpResponse.json()

    if (serpData.error) {
      throw new Error(serpData.error)
    }

    // Normalize job results
    const jobs = (serpData.jobs_results || []).map((job) => ({
      title: job.title || 'Untitled Position',
      company: job.company_name || 'Unknown Company',
      location: job.location || location,
      link: job.link || '#',
      description: job.description || 'No description available',
      jobType: job.job_type || undefined,
      salary: job.salary || undefined,
    }))

    return res.status(200).json({ jobs })
  } catch (error: any) {
    console.error('Error searching jobs:', error)
    return res.status(500).json({
      message: 'Failed to search jobs',
      error: error.message,
    })
  }
}

function buildSearchQuery(params: JobSearchParams): string {
  const fieldMap: Record<string, string> = {
    tech: 'technology software developer',
    healthcare: 'healthcare medical',
    business: 'business management',
    arts: 'arts design creative',
    trades: 'trades skilled labor',
    education: 'education teaching',
    finance: 'finance accounting',
    marketing: 'marketing advertising',
    engineering: 'engineering',
    sales: 'sales',
  }

  const fieldQuery = fieldMap[params.field] || params.field
  const topSkills = params.skills.slice(0, 3).join(' ')
  
  // Build query based on preference
  let query = `${fieldQuery} jobs`
  if (topSkills) {
    query += ` ${topSkills}`
  }
  if (params.preference === 'remote') {
    query += ' remote'
  } else if (params.preference === 'hybrid') {
    query += ' hybrid'
  }

  return query
}

function generateMockJobs(params: JobSearchParams): any[] {
  // Generate mock jobs for development/testing
  const fieldTitles: Record<string, string[]> = {
    tech: [
      'Software Engineer',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'DevOps Engineer',
    ],
    healthcare: [
      'Registered Nurse',
      'Medical Assistant',
      'Healthcare Administrator',
      'Physical Therapist',
      'Pharmacy Technician',
    ],
    business: [
      'Business Analyst',
      'Project Manager',
      'Operations Manager',
      'Business Development Manager',
      'Consultant',
    ],
    arts: [
      'Graphic Designer',
      'UI/UX Designer',
      'Creative Director',
      'Art Director',
      'Illustrator',
    ],
    trades: [
      'Electrician',
      'Plumber',
      'Carpenter',
      'HVAC Technician',
      'Welder',
    ],
    education: [
      'Teacher',
      'School Administrator',
      'Curriculum Developer',
      'Tutor',
      'Education Coordinator',
    ],
    finance: [
      'Financial Analyst',
      'Accountant',
      'Investment Advisor',
      'Tax Specialist',
      'Financial Planner',
    ],
    marketing: [
      'Marketing Manager',
      'Digital Marketing Specialist',
      'Content Creator',
      'Social Media Manager',
      'SEO Specialist',
    ],
    engineering: [
      'Mechanical Engineer',
      'Electrical Engineer',
      'Civil Engineer',
      'Chemical Engineer',
      'Aerospace Engineer',
    ],
    sales: [
      'Sales Representative',
      'Account Executive',
      'Sales Manager',
      'Business Development Representative',
      'Inside Sales Specialist',
    ],
  }

  const companies = [
    'TechCorp Inc.',
    'Global Solutions',
    'Innovation Labs',
    'Enterprise Systems',
    'Digital Ventures',
    'Future Technologies',
    'Smart Solutions',
    'NextGen Industries',
  ]

  const locations = params.location
    ? [params.location]
    : [
        'New York, NY',
        'San Francisco, CA',
        'Austin, TX',
        'Seattle, WA',
        'Boston, MA',
        'Chicago, IL',
        'Remote',
      ]

  const titles = fieldTitles[params.field] || ['General Position']
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary']

  return Array.from({ length: 15 }, (_, i) => ({
    title: titles[i % titles.length],
    company: companies[i % companies.length],
    location: locations[i % locations.length],
    link: `https://example.com/job/${i + 1}`,
    description: `We are looking for a talented ${titles[i % titles.length]} to join our team. This position offers great opportunities for growth and development.`,
    jobType: jobTypes[i % jobTypes.length],
    salary: i % 3 === 0 ? `$${(50 + i * 5) * 1000} - $${(70 + i * 5) * 1000}` : undefined,
  }))
}

