import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Job, UserProfile } from '../types'
import { ArrowLeft, Filter, X } from 'lucide-react'
import JobCard from './JobCard'

interface JobResultsProps {
  jobs?: Job[]
  userProfile?: UserProfile | null
}

type SortOption = 'relevance' | 'match-score' | 'location'
type FilterState = {
  location: string
  jobType: string
}

export default function JobResults({ jobs: propsJobs }: JobResultsProps) {
  const location = useLocation()
  const [jobs, setJobs] = useState<Job[]>(propsJobs || [])
  const [, setUserProfile] = useState<UserProfile | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('match-score')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    jobType: '',
  })
  const [expandedJob, setExpandedJob] = useState<string | null>(null)

  // Get data from location state or localStorage
  useEffect(() => {
    const stateJobs = (location.state as any)?.jobs
    const stateProfile = (location.state as any)?.profile

    if (stateJobs && stateJobs.length > 0) {
      setJobs(stateJobs)
    } else {
      // Try localStorage as fallback
      const storedJobs = localStorage.getItem('jobResults')
      if (storedJobs) {
        try {
          setJobs(JSON.parse(storedJobs))
        } catch (e) {
          console.error('Failed to parse stored jobs:', e)
        }
      }
    }

    if (stateProfile) {
      setUserProfile(stateProfile)
    } else {
      const storedProfile = localStorage.getItem('userProfile')
      if (storedProfile) {
        try {
          setUserProfile(JSON.parse(storedProfile))
        } catch (e) {
          console.error('Failed to parse stored profile:', e)
        }
      }
    }
  }, [location.state])

  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs]

    // Apply filters
    if (filters.location) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.jobType) {
      result = result.filter((job) => job.jobType === filters.jobType)
    }

    // Apply sorting
    switch (sortBy) {
      case 'match-score':
        result.sort((a, b) => b.matchScore - a.matchScore)
        break
      case 'location':
        result.sort((a, b) => a.location.localeCompare(b.location))
        break
      case 'relevance':
      default:
        // Already sorted by relevance from backend
        break
    }

    return result
  }, [jobs, sortBy, filters])

  const uniqueLocations = useMemo(() => {
    const locations = new Set(jobs.map((job) => job.location))
    return Array.from(locations).sort()
  }, [jobs])

  const uniqueJobTypes = useMemo(() => {
    const types = new Set(jobs.map((job) => job.jobType).filter(Boolean))
    return Array.from(types).sort()
  }, [jobs])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Your Job Matches
          </h1>
          <p className="text-slate-600 text-lg">
            Found {filteredAndSortedJobs.length} job{filteredAndSortedJobs.length !== 1 ? 's' : ''} matching your profile
          </p>
        </div>

        {/* Controls */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(filters.location || filters.jobType) && (
                  <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {[filters.location, filters.jobType].filter(Boolean).length}
                  </span>
                )}
              </button>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-4"
                >
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                    className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="">All Job Types</option>
                    {uniqueJobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {(filters.location || filters.jobType) && (
                    <button
                      onClick={() => setFilters({ location: '', jobType: '' })}
                      className="flex items-center gap-1 px-4 py-2 text-slate-600 hover:text-slate-900"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="match-score">Match Score</option>
                <option value="relevance">Relevance</option>
                <option value="location">Location</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job List */}
        {filteredAndSortedJobs.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-xl text-slate-600 mb-2">No jobs found</p>
            <p className="text-slate-500">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {filteredAndSortedJobs.map((job, index) => (
                <JobCard
                  key={job.link}
                  job={job}
                  index={index}
                  isExpanded={expandedJob === job.link}
                  onToggleExpand={() =>
                    setExpandedJob(expandedJob === job.link ? null : job.link)
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

