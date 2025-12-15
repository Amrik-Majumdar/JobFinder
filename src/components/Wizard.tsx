import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UserProfile, Job } from '../types'
import { analyzeResume, searchJobs, matchJobs } from '../api/client'
import StepBasicInfo from './wizard/StepBasicInfo'
import StepEducation from './wizard/StepEducation'
import StepField from './wizard/StepField'
import StepPreferences from './wizard/StepPreferences'
import StepResume from './wizard/StepResume'
import StepReview from './wizard/StepReview'
import ProgressBar from './ProgressBar'
import LoadingSpinner from './LoadingSpinner'

interface WizardProps {
  onComplete: (profile: UserProfile, jobs: Job[]) => void
}

const TOTAL_STEPS = 6

export default function Wizard({ onComplete }: WizardProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<Partial<UserProfile>>({})

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = async () => {
    if (!profile.age || !profile.education || !profile.field || !profile.preference) {
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Analyze resume if provided
      let skills: { hardSkills: string[]; softSkills: string[]; experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'; industryAlignment: string[] } = { hardSkills: [], softSkills: [], experienceLevel: 'entry', industryAlignment: [] }
      
      if (profile.resume) {
        const analysis = await analyzeResume(profile.resume)
        skills = analysis.skills
      }

      // Step 2: Search for jobs
      const searchParams = {
        skills: [...skills.hardSkills, ...skills.softSkills],
        field: profile.field,
        education: profile.education,
        age: profile.age,
        preference: profile.preference,
        location: profile.location,
      }

      const jobSearchResults = await searchJobs(searchParams)

      // Step 3: Match jobs with user profile
      const matchedJobs = await matchJobs({
        jobs: jobSearchResults.jobs,
        skills,
        userProfile: {
          age: profile.age,
          education: profile.education,
          field: profile.field,
          preference: profile.preference,
        },
      })

      // Store in localStorage as backup
      localStorage.setItem('jobResults', JSON.stringify(matchedJobs))
      localStorage.setItem('userProfile', JSON.stringify(profile))

      if (onComplete) {
        onComplete(profile as UserProfile, matchedJobs)
      }
      
      navigate('/results', { state: { jobs: matchedJobs, profile } })
    } catch (error) {
      console.error('Error completing wizard:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!profile.age && profile.age >= 16 && profile.age <= 100
      case 2:
        return !!profile.education
      case 3:
        return !!profile.field
      case 4:
        return !!profile.preference
      case 5:
        return true // Resume is optional
      case 6:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              AI Job Finder
            </h1>
            <p className="text-slate-600 text-lg">
              Let's find your perfect job match
            </p>
          </div>

          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <div className="mt-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <StepBasicInfo
                  key="step1"
                  profile={profile}
                  updateProfile={updateProfile}
                />
              )}
              {currentStep === 2 && (
                <StepEducation
                  key="step2"
                  profile={profile}
                  updateProfile={updateProfile}
                />
              )}
              {currentStep === 3 && (
                <StepField
                  key="step3"
                  profile={profile}
                  updateProfile={updateProfile}
                />
              )}
              {currentStep === 4 && (
                <StepPreferences
                  key="step4"
                  profile={profile}
                  updateProfile={updateProfile}
                />
              )}
              {currentStep === 5 && (
                <StepResume
                  key="step5"
                  profile={profile}
                  updateProfile={updateProfile}
                />
              )}
              {currentStep === 6 && (
                <StepReview
                  key="step6"
                  profile={profile as UserProfile}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              Previous
            </button>

            {currentStep === TOTAL_STEPS ? (
              <button
                onClick={handleComplete}
                disabled={isLoading || !canProceed()}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105"
              >
                {isLoading ? <LoadingSpinner /> : 'Find Jobs'}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

