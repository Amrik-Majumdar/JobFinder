export type EducationLevel =
  | 'middle-school'
  | 'high-school-student'
  | 'high-school-graduate'
  | 'bachelors'
  | 'masters'
  | 'doctorate'

export type JobField =
  | 'tech'
  | 'healthcare'
  | 'business'
  | 'arts'
  | 'trades'
  | 'education'
  | 'finance'
  | 'marketing'
  | 'engineering'
  | 'sales'

export type WorkPreference = 'remote' | 'hybrid' | 'on-site'

export interface UserProfile {
  age: number
  education: EducationLevel
  field: JobField
  preference: WorkPreference
  location?: string
  resume?: File
}

export interface ResumeSkills {
  hardSkills: string[]
  softSkills: string[]
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
  industryAlignment: string[]
  yearsOfExperience?: number
}

export interface Job {
  title: string
  company: string
  location: string
  link: string
  description: string
  matchScore: number
  matchedSkills: string[]
  jobType?: string
  salary?: string
}

export interface JobSearchParams {
  skills: string[]
  field: JobField
  education: EducationLevel
  age: number
  preference: WorkPreference
  location?: string
}

