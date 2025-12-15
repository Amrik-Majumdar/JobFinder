import { motion } from 'framer-motion'
import { UserProfile, JobField } from '../../types'
import { Check } from 'lucide-react'

interface StepFieldProps {
  profile: Partial<UserProfile>
  updateProfile: (updates: Partial<UserProfile>) => void
}

const fieldOptions: { value: JobField; label: string; emoji: string }[] = [
  { value: 'tech', label: 'Technology', emoji: '💻' },
  { value: 'healthcare', label: 'Healthcare', emoji: '🏥' },
  { value: 'business', label: 'Business', emoji: '💼' },
  { value: 'arts', label: 'Arts & Design', emoji: '🎨' },
  { value: 'trades', label: 'Trades & Skilled Labor', emoji: '🔧' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'marketing', label: 'Marketing', emoji: '📢' },
  { value: 'engineering', label: 'Engineering', emoji: '⚙️' },
  { value: 'sales', label: 'Sales', emoji: '🤝' },
]

export default function StepField({ profile, updateProfile }: StepFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Desired Job Field</h2>
      <p className="text-slate-600 mb-8">Which industry or field interests you most?</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {fieldOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => updateProfile({ field: option.value })}
            className={`p-4 rounded-xl border-2 transition-all ${
              profile.field === option.value
                ? 'border-primary-500 bg-primary-50 shadow-md scale-105'
                : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">{option.emoji}</span>
              <div className="font-medium text-slate-900 text-sm text-center">
                {option.label}
              </div>
              {profile.field === option.value && (
                <Check className="w-4 h-4 text-primary-600 mt-1" />
              )}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

