import { motion } from 'framer-motion'
import { UserProfile, EducationLevel, JobField, WorkPreference } from '../../types'
import { CheckCircle, FileText } from 'lucide-react'

interface StepReviewProps {
  profile: UserProfile
}

const educationLabels: Record<EducationLevel, string> = {
  'middle-school': 'Middle School',
  'high-school-student': 'High School Student',
  'high-school-graduate': 'High School Graduate',
  'bachelors': "Bachelor's Degree",
  'masters': "Master's Degree",
  'doctorate': 'Doctorate',
}

const fieldLabels: Record<JobField, string> = {
  tech: 'Technology',
  healthcare: 'Healthcare',
  business: 'Business',
  arts: 'Arts & Design',
  trades: 'Trades & Skilled Labor',
  education: 'Education',
  finance: 'Finance',
  marketing: 'Marketing',
  engineering: 'Engineering',
  sales: 'Sales',
}

const preferenceLabels: Record<WorkPreference, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  'on-site': 'On-site',
}

export default function StepReview({ profile }: StepReviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Your Information</h2>
      <p className="text-slate-600 mb-8">Please review your details before we find your perfect job matches.</p>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-600 mb-1">Age</div>
          <div className="font-semibold text-slate-900">{profile.age} years old</div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-600 mb-1">Education Level</div>
          <div className="font-semibold text-slate-900">
            {educationLabels[profile.education]}
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-600 mb-1">Desired Field</div>
          <div className="font-semibold text-slate-900">
            {fieldLabels[profile.field]}
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-600 mb-1">Work Preference</div>
          <div className="font-semibold text-slate-900">
            {preferenceLabels[profile.preference]}
          </div>
        </div>

        {profile.location && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Preferred Location</div>
            <div className="font-semibold text-slate-900">{profile.location}</div>
          </div>
        )}

        {profile.resume ? (
          <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-primary-600" />
              <div>
                <div className="text-sm text-slate-600 mb-1">Resume</div>
                <div className="font-semibold text-slate-900">{profile.resume.name}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="text-sm text-amber-800">
              No resume uploaded. Job matching will be based on your preferences only.
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 flex items-start space-x-3">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-green-800">
          <div className="font-medium mb-1">Ready to find your perfect match!</div>
          <div>Click "Find Jobs" to start your personalized job search.</div>
        </div>
      </div>
    </motion.div>
  )
}

