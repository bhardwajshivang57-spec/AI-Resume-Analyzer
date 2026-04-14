import { useState, useEffect } from 'react'
import { ArrowRight, File, AlertCircle, CheckCircle, BarChart3, Award, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { resumeAPI } from '../utils/api'

interface Resume {
  _id: string
  fileName: string
  parsedData?: {
    name: string
    email: string
    skills: string[]
    experience: any[]
    education: any[]
  }
  analysis?: {
    atsScore: number
    keywordMatch: number
    skillGaps: string[]
    suggestions: string[]
    strengths: string[]
  }
}

const CompareResumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [resume1, setResume1] = useState<Resume | null>(null)
  const [resume2, setResume2] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await resumeAPI.getUserResumes()
      const userResumes = response.data.resumes || []
      setResumes(userResumes)
    } catch (err) {
      setError('Failed to load resumes')
      console.error('Error fetching resumes:', err)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getComparisonResult = (val1: number, val2: number) => {
    if (val1 > val2) return 'better'
    if (val1 < val2) return 'worse'
    return 'equal'
  }

  const renderSkillComparison = () => {
    const skills1 = resume1?.parsedData?.skills || []
    const skills2 = resume2?.parsedData?.skills || []

    const uniqueSkills1 = skills1.filter((s: string) => !skills2.includes(s))
    const uniqueSkills2 = skills2.filter((s: string) => !skills1.includes(s))
    const commonSkills = skills1.filter((s: string) => skills2.includes(s))

    return {
      unique1: uniqueSkills1,
      unique2: uniqueSkills2,
      common: commonSkills,
    }
  }

  const skillComparison = resume1 && resume2 ? renderSkillComparison() : null

  const getOverallWinner = () => {
    if (!resume1 || !resume2) return null

    const score1 = (resume1.analysis?.atsScore || 0) + (resume1.analysis?.keywordMatch || 0)
    const score2 = (resume2.analysis?.atsScore || 0) + (resume2.analysis?.keywordMatch || 0)

    if (score1 > score2) return 'resume1'
    if (score2 > score1) return 'resume2'
    return 'tie'
  }

  const winner = getOverallWinner()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-900 dark:to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Compare Resumes
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
              Side-by-side comparison to identify strengths and areas for improvement
            </p>
          </div>

          {/* Error State */}
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
          ) : resumes.length < 2 ? (
            <div className="card-glass text-center py-16">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Need at least 2 resumes</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Upload more resumes to compare them side by side</p>
            </div>
          ) : (
            <>
              {/* Resume Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12"
              >
                {/* Resume 1 Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card-glass p-4"
                >
                  <label className="block text-xs sm:text-sm font-bold mb-3 text-gray-900 dark:text-white">
                    SELECT FIRST RESUME
                  </label>
                  <select
                    value={resume1?._id || ''}
                    onChange={(e) => {
                      const selected = resumes.find(r => r._id === e.target.value)
                      setResume1(selected || null)
                    }}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-dark-900 dark:text-white text-xs sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Choose a resume...</option>
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.parsedData?.name || r.fileName}
                      </option>
                    ))}
                  </select>
                  {resume1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20"
                    >
                      <p className="text-xs sm:text-sm font-medium text-primary">✓ {resume1.parsedData?.name || resume1.fileName}</p>
                    </motion.div>
                  )}
                </motion.div>

                {/* VS Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-400 dark:text-dark-500 mb-2">VS</div>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-dark-500 mx-auto" />
                  </div>
                </motion.div>

                {/* Resume 2 Selection */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card-glass p-4"
                >
                  <label className="block text-xs sm:text-sm font-bold mb-3 text-gray-900 dark:text-white">
                    SELECT SECOND RESUME
                  </label>
                  <select
                    value={resume2?._id || ''}
                    onChange={(e) => {
                      const selected = resumes.find(r => r._id === e.target.value)
                      setResume2(selected || null)
                    }}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-dark-900 dark:text-white text-xs sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Choose a resume...</option>
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id} disabled={r._id === resume1?._id}>
                        {r.parsedData?.name || r.fileName}
                      </option>
                    ))}
                  </select>
                  {resume2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20"
                    >
                      <p className="text-xs sm:text-sm font-medium text-secondary">✓ {resume2.parsedData?.name || resume2.fileName}</p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              {/* Comparison Results */}
              <AnimatePresence mode="wait">
                {resume1 && resume2 ? (
                  <motion.div
                    key="comparison"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Winner Badge */}
                    {winner !== 'tie' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 dark:border-primary/50 rounded-lg text-center"
                      >
                        <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="font-bold text-gray-900 dark:text-white">
                          {winner === 'resume1'
                            ? `${resume1.parsedData?.name || 'Resume 1'} is stronger`
                            : `${resume2.parsedData?.name || 'Resume 2'} is stronger`}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Based on overall analysis scores</p>
                      </motion.div>
                    )}

                    {/* Scores Comparison */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* ATS Score */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-primary" />
                          ATS Score Comparison
                        </h3>

                        <div className="space-y-6">
                          {/* Resume 1 Score */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {resume1.parsedData?.name || 'Resume 1'}
                              </p>
                              <span className={`text-2xl font-bold ${getScoreColor(resume1.analysis?.atsScore || 0)}`}>
                                {resume1.analysis?.atsScore || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${resume1.analysis?.atsScore || 0}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                              />
                            </div>
                          </div>

                          {/* Resume 2 Score */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {resume2.parsedData?.name || 'Resume 2'}
                              </p>
                              <span className={`text-2xl font-bold ${getScoreColor(resume2.analysis?.atsScore || 0)}`}>
                                {resume2.analysis?.atsScore || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${resume2.analysis?.atsScore || 0}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-secondary to-primary"
                              />
                            </div>
                          </div>

                          {/* Difference */}
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">DIFFERENCE</p>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                              {Math.abs(
                                (resume1.analysis?.atsScore || 0) - (resume2.analysis?.atsScore || 0)
                              )}%{' '}
                              {getComparisonResult(resume1.analysis?.atsScore || 0, resume2.analysis?.atsScore || 0) === 'better'
                                ? '(Resume 1 ahead)'
                                : getComparisonResult(resume1.analysis?.atsScore || 0, resume2.analysis?.atsScore || 0) === 'worse'
                                ? '(Resume 2 ahead)'
                                : '(Equal)'}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Keyword Match */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="card"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-secondary" />
                          Keyword Match Comparison
                        </h3>

                        <div className="space-y-6">
                          {/* Resume 1 Score */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {resume1.parsedData?.name || 'Resume 1'}
                              </p>
                              <span className={`text-2xl font-bold ${getScoreColor(resume1.analysis?.keywordMatch || 0)}`}>
                                {resume1.analysis?.keywordMatch || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${resume1.analysis?.keywordMatch || 0}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                              />
                            </div>
                          </div>

                          {/* Resume 2 Score */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {resume2.parsedData?.name || 'Resume 2'}
                              </p>
                              <span className={`text-2xl font-bold ${getScoreColor(resume2.analysis?.keywordMatch || 0)}`}>
                                {resume2.analysis?.keywordMatch || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${resume2.analysis?.keywordMatch || 0}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-secondary to-primary"
                              />
                            </div>
                          </div>

                          {/* Difference */}
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">DIFFERENCE</p>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                              {Math.abs(
                                (resume1.analysis?.keywordMatch || 0) - (resume2.analysis?.keywordMatch || 0)
                              )}%{' '}
                              {getComparisonResult(resume1.analysis?.keywordMatch || 0, resume2.analysis?.keywordMatch || 0) === 'better'
                                ? '(Resume 1 ahead)'
                                : getComparisonResult(resume1.analysis?.keywordMatch || 0, resume2.analysis?.keywordMatch || 0) === 'worse'
                                ? '(Resume 2 ahead)'
                                : '(Equal)'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Skills Comparison */}
                    {skillComparison && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Skills Comparison</h3>

                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Resume 1 Unique Skills */}
                          <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                              {resume1.parsedData?.name || 'Resume 1'} Only ({skillComparison.unique1.length})
                            </p>
                            <div className="space-y-2">
                              {skillComparison.unique1.slice(0, 5).map((skill: string, i: number) => (
                                <div
                                  key={i}
                                  className="p-2 bg-primary/10 rounded-lg text-sm text-primary dark:text-primary-400 font-medium"
                                >
                                  {skill}
                                </div>
                              ))}
                              {skillComparison.unique1.length > 5 && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 pt-2">
                                  +{skillComparison.unique1.length - 5} more
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Common Skills */}
                          <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                              Common Skills ({skillComparison.common.length})
                            </p>
                            <div className="space-y-2">
                              {skillComparison.common.slice(0, 5).map((skill: string, i: number) => (
                                <div
                                  key={i}
                                  className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-sm text-green-700 dark:text-green-400 font-medium"
                                >
                                  {skill}
                                </div>
                              ))}
                              {skillComparison.common.length > 5 && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 pt-2">
                                  +{skillComparison.common.length - 5} more
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Resume 2 Unique Skills */}
                          <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                              {resume2.parsedData?.name || 'Resume 2'} Only ({skillComparison.unique2.length})
                            </p>
                            <div className="space-y-2">
                              {skillComparison.unique2.slice(0, 5).map((skill: string, i: number) => (
                                <div
                                  key={i}
                                  className="p-2 bg-secondary/10 rounded-lg text-sm text-secondary dark:text-secondary-400 font-medium"
                                >
                                  {skill}
                                </div>
                              ))}
                              {skillComparison.unique2.length > 5 && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 pt-2">
                                  +{skillComparison.unique2.length - 5} more
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Experience Comparison */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="grid md:grid-cols-2 gap-8"
                    >
                      {/* Resume 1 Experience */}
                      <div className="card">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                          {resume1.parsedData?.name || 'Resume 1'} - Experience
                        </h4>
                        <div className="space-y-3">
                          {resume1.parsedData?.experience && resume1.parsedData.experience.length > 0 ? (
                            resume1.parsedData.experience.slice(0, 3).map((exp: any, i: number) => (
                              <div key={i} className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                                <p className="font-medium text-sm text-gray-900 dark:text-white">{exp.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{exp.company}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">No experience listed</p>
                          )}
                          {resume1.parsedData?.experience && resume1.parsedData.experience.length > 3 && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              +{resume1.parsedData.experience.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Resume 2 Experience */}
                      <div className="card">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                          {resume2.parsedData?.name || 'Resume 2'} - Experience
                        </h4>
                        <div className="space-y-3">
                          {resume2.parsedData?.experience && resume2.parsedData.experience.length > 0 ? (
                            resume2.parsedData.experience.slice(0, 3).map((exp: any, i: number) => (
                              <div key={i} className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                                <p className="font-medium text-sm text-gray-900 dark:text-white">{exp.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{exp.company}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">No experience listed</p>
                          )}
                          {resume2.parsedData?.experience && resume2.parsedData.experience.length > 3 && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              +{resume2.parsedData.experience.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Key Insights */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="card border-l-4 border-blue-500"
                    >
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        💡 Key Insights
                      </h3>
                      <ul className="space-y-3">
                        {resume1.analysis?.strengths && resume1.analysis.strengths.length > 0 && (
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              <strong>{resume1.parsedData?.name || 'Resume 1'}:</strong> {resume1.analysis.strengths[0]}
                            </span>
                          </li>
                        )}
                        {resume2.analysis?.strengths && resume2.analysis.strengths.length > 0 && (
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              <strong>{resume2.parsedData?.name || 'Resume 2'}:</strong> {resume2.analysis.strengths[0]}
                            </span>
                          </li>
                        )}
                        <li className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Both resumes have{' '}
                            {skillComparison?.common ? `${skillComparison.common.length} common skills` : 'unique strengths'}
                          </span>
                        </li>
                      </ul>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card-glass text-center py-16"
                  >
                    <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Select two resumes to see a detailed comparison
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default CompareResumes
