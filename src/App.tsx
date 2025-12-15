import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Wizard from './components/Wizard'
import JobResults from './components/JobResults'
import { UserProfile, Job } from './types'

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])

  return (
    <BrowserRouter basename="/Joby">
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <Wizard
                onComplete={(profile, jobResults) => {
                  setUserProfile(profile)
                  setJobs(jobResults)
                }}
              />
            }
          />
          <Route
            path="/results"
            element={<JobResults jobs={jobs} userProfile={userProfile} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

