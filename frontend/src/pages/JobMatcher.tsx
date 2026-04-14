import { useState, useEffect } from 'react'
import { Zap, AlertCircle, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { matchingAPI, resumeAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'

interface Resume {
  _id: string
  fileName: string
  parsedData: {
    name: string
    skills: string[]
  }
}

interface MatchResult {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
}

const JobMatcher = () => {
  const { isAuthenticated } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<MatchResult | null>(null)
  const [error, setError] = useState('')

  // Fetch user resumes on mount
  useEffect(() => {
    fetchResumes()
  }, [isAuthenticated])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await resumeAPI.getUserResumes()
      const userResumes = response.data.resumes || []
      setResumes(userResumes)
      
      // Auto-select the first resume
      if (userResumes.length > 0) {
        setSelectedResumeId(userResumes[0]._id)
      }
    } catch (err) {
      setError('Failed to load your resumes. Please make sure you have uploaded a resume.')
      console.error('Error fetching resumes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description')
      return
    }

    if (!selectedResumeId) {
      setError('Please select a resume to analyze')
      return
    }

    setAnalyzing(true)
    setError('')
    try {
      const response = await matchingAPI.scoreJob(selectedResumeId, jobDescription)
      setResults(response.data)
    } catch (err) {
      setError('Failed to analyze job description. Please try again.')
      console.error('Matching failed:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Job Matcher</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8">Match your resume against job descriptions to see how well you fit</p>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg text-red-700 dark:text-red-300"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading your resumes...</p>
            </div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="card-glass text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No resumes found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Please upload a resume first to use the Job Matcher</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="card-glass lg:sticky lg:top-24 space-y-4 p-4 sm:p-6">
                {/* Resume Selector */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2">Select Resume</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-dark-900 dark:text-white text-xs sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.parsedData?.name || resume.fileName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h2 className="text-lg sm:text-2xl font-bold mb-4">Paste Job Description</h2>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-32 sm:h-48 p-3 sm:p-4 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-dark-900 dark:text-white text-xs sm:text-sm resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!jobDescription.trim() || analyzing}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {analyzing ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-3 h-3 border-2 border-white border-t-transparent mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 inline" />
                      Analyze Match
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              {!results ? (
                <div className="card-glass text-center py-16">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Paste a job description to see match results
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="card space-y-6 p-4 sm:p-6"
                >
                  {/* Match Score */}
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                      <h3 className="text-xl sm:text-2xl font-bold">Match Score</h3>
                      <div className="text-right">
                        <div className="text-3xl sm:text-4xl font-bold text-primary">{results.score}%</div>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="relative w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${results.score}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full ${
                          results.score >= 80
                            ? 'bg-green-500'
                            : results.score >= 60
                            ? 'bg-yellow-500'
                            : results.score >= 40
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>

                    {/* Score Interpretation */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {results.score >= 80
                        ? '🎉 Excellent match! You have strong alignment with this role.'
                        : results.score >= 60
                        ? '👍 Good match! You have many of the required skills.'
                        : results.score >= 40
                        ? '⚠️ Fair match. Consider learning some of the missing skills.'
                        : '📚 Low match. You may need to develop several key skills.'}
                    </p>
                  </div>

                  {/* Matched Skills */}
                  {results.matchedSkills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                        ✓ Matched Skills ({results.matchedSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {results.matchedSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs sm:text-sm rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {results.missingSkills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                        ✕ Missing Skills ({results.missingSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {results.missingSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs sm:text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3">
                        💡 <strong>Tip:</strong> Consider learning these skills to improve your match score and increase your chances
                      </p>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-xs sm:text-sm text-blue-900 dark:text-blue-200 mb-2">Next Steps</h4>
                    <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>✓ Visit the Recommendations page to find courses for missing skills</li>
                      <li>✓ Update your resume to highlight matching skills</li>
                      <li>✓ Use this analysis to tailor your application</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default JobMatcher
