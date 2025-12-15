import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UserProfile } from '../../types'
import { FileText, Upload, X } from 'lucide-react'

interface StepResumeProps {
  profile: Partial<UserProfile>
  updateProfile: (updates: Partial<UserProfile>) => void
}

export default function StepResume({ profile, updateProfile }: StepResumeProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      updateProfile({ resume: acceptedFiles[0] })
    }
  }, [updateProfile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
  })

  const removeResume = () => {
    updateProfile({ resume: undefined })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Resume Upload</h2>
      <p className="text-slate-600 mb-8">
        Upload your resume for AI-powered skill extraction (optional but recommended)
      </p>

      {!profile.resume ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 scale-105'
              : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-primary-600 font-medium">Drop your resume here...</p>
          ) : (
            <>
              <p className="text-slate-700 font-medium mb-2">
                Drag & drop your resume here, or click to select
              </p>
              <p className="text-sm text-slate-500">
                Supports PDF, DOC, and DOCX files
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border-2 border-primary-200 bg-primary-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">{profile.resume.name}</div>
                <div className="text-sm text-slate-600">
                  {(profile.resume.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
            <button
              onClick={removeResume}
              className="p-2 hover:bg-primary-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-sm text-slate-500 text-center">
        Your resume will be analyzed using AI to extract your skills and experience
      </p>
    </motion.div>
  )
}

