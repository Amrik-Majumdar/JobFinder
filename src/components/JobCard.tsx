import { motion } from 'framer-motion'
import { Job } from '../types'
import { MapPin, Building2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

interface JobCardProps {
  job: Job
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
}

export default function JobCard({ job, index, isExpanded, onToggleExpand }: JobCardProps) {
  const matchColor =
    job.matchScore >= 80
      ? 'text-green-600 bg-green-50'
      : job.matchScore >= 60
      ? 'text-blue-600 bg-blue-50'
      : 'text-amber-600 bg-amber-50'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass rounded-2xl p-6 card-hover"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h3>
              <div className="flex flex-wrap items-center gap-4 text-slate-600">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                {job.jobType && (
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-sm">
                    {job.jobType}
                  </span>
                )}
                {job.salary && (
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium">
                    {job.salary}
                  </span>
                )}
              </div>
            </div>

            {/* Match Score */}
            <div
              className={`px-4 py-2 rounded-xl font-bold text-lg ${matchColor} flex-shrink-0`}
            >
              {job.matchScore}% Match
            </div>
          </div>

          {/* Matched Skills */}
          {job.matchedSkills.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-slate-600 mb-2">Matched Skills:</div>
              <div className="flex flex-wrap gap-2">
                {job.matchedSkills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.matchedSkills.length > 5 && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                    +{job.matchedSkills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description Preview */}
          <p className="text-slate-700 line-clamp-3 mb-4">
            {job.description}
          </p>

          {/* Expanded Description */}
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-slate-200"
            >
              <div className="prose prose-sm max-w-none">
                <p className="text-slate-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4">
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onToggleExpand}
              className="inline-flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show More
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

