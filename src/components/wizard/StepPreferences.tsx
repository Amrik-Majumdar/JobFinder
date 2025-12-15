import { motion } from 'framer-motion'
import { UserProfile, WorkPreference } from '../../types'
import { Check, MapPin } from 'lucide-react'

interface StepPreferencesProps {
  profile: Partial<UserProfile>
  updateProfile: (updates: Partial<UserProfile>) => void
}

const preferenceOptions: { value: WorkPreference; label: string; description: string }[] = [
  { value: 'remote', label: 'Remote', description: 'Work from anywhere' },
  { value: 'hybrid', label: 'Hybrid', description: 'Mix of remote and office' },
  { value: 'on-site', label: 'On-site', description: 'Work at office location' },
]

export default function StepPreferences({ profile, updateProfile }: StepPreferencesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Work Preferences</h2>
      <p className="text-slate-600 mb-8">How do you prefer to work?</p>

      <div className="space-y-4 mb-6">
        {preferenceOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => updateProfile({ preference: option.value })}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              profile.preference === option.value
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">{option.label}</div>
                <div className="text-sm text-slate-600 mt-1">{option.description}</div>
              </div>
              {profile.preference === option.value && (
                <Check className="w-5 h-5 text-primary-600" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Preferred Location (Optional)
        </label>
        <input
          id="location"
          type="text"
          value={profile.location || ''}
          onChange={(e) => updateProfile({ location: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
          placeholder="e.g., New York, NY or San Francisco, CA"
        />
        <p className="mt-2 text-sm text-slate-500">
          Leave blank to search all locations
        </p>
      </div>
    </motion.div>
  )
}

