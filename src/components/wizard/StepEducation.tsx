import { motion } from 'framer-motion'
import { UserProfile, EducationLevel } from '../../types'
import { Check } from 'lucide-react'

interface StepEducationProps {
  profile: Partial<UserProfile>
  updateProfile: (updates: Partial<UserProfile>) => void
}

const educationOptions: { value: EducationLevel; label: string; description: string }[] = [
  { value: 'middle-school', label: 'Middle School', description: 'Currently in middle school' },
  { value: 'high-school-student', label: 'High School Student', description: 'Currently enrolled in high school' },
  { value: 'high-school-graduate', label: 'High School Graduate', description: 'Completed high school' },
  { value: 'bachelors', label: "Bachelor's Degree", description: '4-year college degree' },
  { value: 'masters', label: "Master's Degree", description: 'Graduate degree' },
  { value: 'doctorate', label: 'Doctorate', description: 'PhD or professional doctorate' },
]

export default function StepEducation({ profile, updateProfile }: StepEducationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Education Level</h2>
      <p className="text-slate-600 mb-8">What's your highest level of education?</p>

      <div className="space-y-3">
        {educationOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => updateProfile({ education: option.value })}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              profile.education === option.value
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{option.label}</div>
                <div className="text-sm text-slate-600 mt-1">{option.description}</div>
              </div>
              {profile.education === option.value && (
                <Check className="w-5 h-5 text-primary-600" />
              )}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

