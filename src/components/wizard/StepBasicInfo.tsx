import { motion } from 'framer-motion'
import { UserProfile } from '../../types'

interface StepBasicInfoProps {
  profile: Partial<UserProfile>
  updateProfile: (updates: Partial<UserProfile>) => void
}

export default function StepBasicInfo({ profile, updateProfile }: StepBasicInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Basic Information</h2>
      <p className="text-slate-600 mb-8">Let's start with some basic details about you.</p>

      <div className="space-y-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">
            Age
          </label>
          <input
            id="age"
            type="number"
            min="16"
            max="100"
            value={profile.age || ''}
            onChange={(e) => updateProfile({ age: parseInt(e.target.value) || undefined })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
            placeholder="Enter your age"
          />
          <p className="mt-2 text-sm text-slate-500">
            Must be 16 or older to use this service
          </p>
        </div>
      </div>
    </motion.div>
  )
}

