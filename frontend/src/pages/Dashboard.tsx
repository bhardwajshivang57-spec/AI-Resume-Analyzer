import { useState, useEffect } from 'react'
import { Upload, FileText, Trash2, BarChart3, Eye, Zap, TrendingUp, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { resumeAPI } from '../utils/api'
import { useNavigate } from 'react-router-dom'

interface Resume {
  _id: string
  fileName: string
  uploadedAt: string
  createdAt?: string
  atsScore?: number
  analysis?: {
    atsScore: number
    keywordMatch: number
    skillGaps: string[]
    suggestions: string[]
    strengths: string[]
  }
  parsedData?: {
    name: string
    email: string
    skills: string[]
    experience: any[]
  }
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [previewResume, setPreviewResume] = useState<Resume | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const response = await resumeAPI.getUserResumes()
      setResumes(response.data.resumes || [])
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
      alert('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await resumeAPI.deleteResume(id)
      setResumes(resumes.filter(r => r._id !== id))
      setDeleteConfirm(null)
      alert('Resume deleted successfully')
    } catch (error) {
      console.error('Failed to delete resume:', error)
      alert('Failed to delete resume')
    }
  }

  const filteredResumes = resumes.filter(resume =>
    resume.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resume.parsedData?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const avgAtsScore = resumes.length > 0
    ? Math.round((resumes.reduce((acc, r) => acc + (r.atsScore || r.analysis?.atsScore || 0), 0)) / resumes.length)
    : 0

  const avgSkills = Math.round(
    resumes.reduce((acc, r) => acc + (r.parsedData?.skills?.length || 0), 0) / Math.max(resumes.length, 1)
  )

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage, analyze and track your resumes</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Total Resumes</h3>
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold">{resumes.length}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Uploaded files</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Avg ATS Score</h3>
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold">{avgAtsScore}%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Resume score</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Avg Skills</h3>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold">{avgSkills}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Per resume</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Quick Actions</h3>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
            </div>
            <button
              onClick={() => navigate('/analyze-resume')}
              className="text-base sm:text-lg font-bold text-primary hover:text-primary/80 transition-colors"
            >
              New Upload
            </button>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Add resume</p>
          </motion.div>
        </div>

        {/* Resumes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Your Resumes</h2>
            <button
              onClick={() => navigate('/analyze-resume')}
              className="btn-primary text-xs sm:text-sm flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
              Upload New
            </button>
          </div>

          {/* Search Bar */}
          {resumes.length > 0 && (
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by filename or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading resumes...</p>
              </div>
            </div>
          ) : filteredResumes.length === 0 && resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 dark:text-dark-700 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">No resumes uploaded yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Upload your first resume to get started with AI-powered analysis</p>
              <button
                onClick={() => navigate('/analyze-resume')}
                className="btn-primary inline-block"
              >
                <Upload className="w-4 h-4 mr-2 inline" />
                Upload Your First Resume
              </button>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No resumes match your search</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResumes.map((resume, index) => {
                const atsScore = resume.atsScore || resume.analysis?.atsScore || 0
                const uploadDate = new Date(resume.createdAt || resume.uploadedAt)
                const isToday = uploadDate.toDateString() === new Date().toDateString()
                const dateStr = isToday
                  ? uploadDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : uploadDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' })

                return (
                  <motion.div
                    key={resume._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-all"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Resume Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {resume.parsedData?.name || resume.fileName}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                            <span>{resume.fileName}</span>
                            <span>•</span>
                            <span>📅 {dateStr}</span>
                            {resume.parsedData?.skills?.length ? (
                              <>
                                <span>•</span>
                                <span>💼 {resume.parsedData.skills.length} skills</span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* ATS Score */}
                      {atsScore > 0 && (
                        <div className={`flex-shrink-0 px-3 py-2 rounded-lg ${getScoreBgColor(atsScore)}`}>
                          <div className={`text-sm font-bold ${getScoreColor(atsScore)}`}>
                            {atsScore}%
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">ATS</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setPreviewResume(resume)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/job-matcher?resume=${resume._id}`)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-lg transition-colors"
                          title="Job Matcher"
                        >
                          <Zap className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/analyze-resume?resume=${resume._id}`)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 rounded-lg transition-colors"
                          title="Analyze"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(resume._id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewResume(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold">{previewResume.parsedData?.name || previewResume.fileName}</h3>
                <button
                  onClick={() => setPreviewResume(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                {(previewResume.parsedData?.email || previewResume.parsedData?.name) && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">CONTACT</h4>
                    <div className="space-y-1">
                      {previewResume.parsedData?.name && (
                        <p className="font-medium">{previewResume.parsedData.name}</p>
                      )}
                      {previewResume.parsedData?.email && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{previewResume.parsedData.email}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {previewResume.parsedData?.skills && previewResume.parsedData.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-3">SKILLS ({previewResume.parsedData.skills.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {previewResume.parsedData.skills.slice(0, 12).map((skill: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {previewResume.parsedData.skills.length > 12 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{previewResume.parsedData.skills.length - 12} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Analysis */}
                {previewResume.analysis && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">ATS Score</p>
                      <p className={`text-lg font-bold ${getScoreColor(previewResume.analysis.atsScore)}`}>
                        {previewResume.analysis.atsScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Keyword Match</p>
                      <p className={`text-lg font-bold ${getScoreColor(previewResume.analysis.keywordMatch)}`}>
                        {previewResume.analysis.keywordMatch}%
                      </p>
                    </div>
                  </div>
                )}

                {previewResume.analysis?.strengths && previewResume.analysis.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-green-600 dark:text-green-400 mb-2">✓ STRENGTHS</h4>
                    <ul className="space-y-1">
                      {previewResume.analysis.strengths.map((strength: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {previewResume.analysis?.skillGaps && previewResume.analysis.skillGaps.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-orange-600 dark:text-orange-400 mb-2">⚠ SKILL GAPS</h4>
                    <ul className="space-y-1">
                      {previewResume.analysis.skillGaps.slice(0, 5).map((gap: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-bold mb-2">Delete Resume?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this resume? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
