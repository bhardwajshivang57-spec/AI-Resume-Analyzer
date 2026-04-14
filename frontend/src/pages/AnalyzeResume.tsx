import { useState, useEffect } from 'react'
import { Upload, Zap, AlertCircle, CheckCircle, TrendingUp, BookOpen, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { resumeAPI } from '../utils/api'
import { useNavigate } from 'react-router-dom'

interface AnalysisResult {
  atsScore: number
  keywordMatch: number
  skillGaps: string[]
  suggestions: string[]
  grammarIssues: string[]
  strengths: string[]
}

interface UploadedResume {
  _id: string
  fileName: string
}

const AnalyzeResume = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [uploadedResume, setUploadedResume] = useState<UploadedResume | null>(null)
  const navigate = useNavigate()

  // Reset form when component mounts
  useEffect(() => {
    setFile(null)
    setAnalysis(null)
    setError('')
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError('')
    const files = e.dataTransfer.files
    if (files && files[0]) {
      validateFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    if (e.target.files?.[0]) {
      validateFile(e.target.files[0])
    }
  }

  const validateFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF or DOCX file.')
      return
    }

    if (selectedFile.size > maxSize) {
      setError('File is too large. Maximum size is 10MB.')
      return
    }

    setFile(selectedFile)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Upload resume first
      const formData = new FormData()
      formData.append('file', file)
      const uploadResponse = await resumeAPI.upload(formData)
      const resumeId = uploadResponse.data.resumeId

      setUploadedResume({
        _id: resumeId,
        fileName: file.name
      })

      // Analyze resume
      await resumeAPI.analyze(resumeId)
      const analysisResponse = await resumeAPI.getAnalysis(resumeId)
      setAnalysis(analysisResponse.data)
    } catch (err: any) {
      console.error('Analysis failed:', err)
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.')
      setAnalysis(null)
      setUploadedResume(null)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600'
    if (score >= 60) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return '🎉 Excellent! Your resume is ATS-friendly'
    if (score >= 60) return '👍 Good! Your resume is mostly ATS-friendly'
    if (score >= 40) return '⚠️ Fair. Consider improving ATS compatibility'
    return '📊 Low. Significant improvements needed'
  }

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
              Analyze Your Resume
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
              Get instant AI-powered feedback and improve your resume for better job opportunities
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Upload Section - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="card-glass lg:sticky lg:top-24">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Upload Resume
                </h2>

                {/* Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-gray-300 dark:border-dark-600 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <motion.div
                    animate={{ y: dragActive ? -5 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-primary opacity-60" />
                    <p className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                      Drag your resume here
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Supported formats: PDF, DOCX (Max 10MB)
                    </p>
                  </motion.div>

                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="btn-secondary text-xs sm:text-sm cursor-pointer">
                    Browse Files
                  </label>
                </div>

                {/* File Selected State */}
                <AnimatePresence>
                  {file && !error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                            FILE SELECTED
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error State */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!file || loading || !!error}
                  className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2 inline" />
                      Analyze Resume
                    </>
                  )}
                </button>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                    💡 Pro Tip
                  </p>
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    Our AI analyzes your resume for ATS compatibility, keywords, and improvements
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Results Section - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <AnimatePresence mode="wait">
                {analysis && uploadedResume ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Success Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-200">Analysis Complete!</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{uploadedResume.fileName}</p>
                      </div>
                    </motion.div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* ATS Score */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="card p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">ATS Score</h3>
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>

                        <div className="relative w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3 overflow-hidden mb-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.atsScore}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className={`h-full bg-gradient-to-r ${getScoreBgColor(analysis.atsScore)}`}
                          />
                        </div>

                        <div className="flex items-baseline justify-between">
                          <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                            {analysis.atsScore}%
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {analysis.atsScore >= 80 ? '✓ Excellent' : analysis.atsScore >= 60 ? '→ Good' : '↑ Needs Work'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                          {getScoreInterpretation(analysis.atsScore)}
                        </p>
                      </motion.div>

                      {/* Keyword Match */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        className="card p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Keyword Match</h3>
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                        </div>

                        <div className="relative w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3 overflow-hidden mb-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.keywordMatch}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                            className={`h-full bg-gradient-to-r ${getScoreBgColor(analysis.keywordMatch)}`}
                          />
                        </div>

                        <div className="flex items-baseline justify-between">
                          <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(analysis.keywordMatch)}`}>
                            {analysis.keywordMatch}%
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {analysis.keywordMatch >= 80 ? '✓ Excellent' : analysis.keywordMatch >= 60 ? '→ Good' : '↑ Needs Work'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          Industry keywords and relevance detected in resume
                        </p>
                      </motion.div>
                    </div>

                    {/* Strengths */}
                    {analysis.strengths && analysis.strengths.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card border-l-4 border-green-500 p-4"
                      >
                        <h3 className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          Strengths
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {analysis.strengths.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.25 + i * 0.05 }}
                              className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                            >
                              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">✓ {item}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Skill Gaps */}
                    {analysis.skillGaps && analysis.skillGaps.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="card border-l-4 border-orange-500 p-4"
                      >
                        <h3 className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          Skill Gaps
                        </h3>
                        <div className="space-y-2">
                          {analysis.skillGaps.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.05 }}
                              className="flex items-center gap-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                            >
                              <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">•</span>
                              <span className="text-xs sm:text-sm text-gray-900 dark:text-white">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Suggestions */}
                    {analysis.suggestions && analysis.suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card border-l-4 border-blue-500 p-4"
                      >
                        <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                          Recommendations
                        </h3>
                        <div className="space-y-2">
                          {analysis.suggestions.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.35 + i * 0.05 }}
                              className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                            >
                              <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">→</span>
                              <span className="text-sm text-gray-900 dark:text-white">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="grid md:grid-cols-2 gap-4 pt-6"
                    >
                      <button
                        onClick={() => navigate('/recommendations')}
                        className="btn-primary flex items-center justify-center gap-2"
                      >
                        View Recommendations
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setFile(null)
                          setAnalysis(null)
                          setError('')
                        }}
                        className="btn-secondary"
                      >
                        Analyze Another Resume
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card-glass text-center py-24"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Zap className="w-24 h-24 text-primary/30 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      Ready to Get Started?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-8">
                      Upload your resume on the left to receive instant AI-powered analysis, ATS scoring, and personalized recommendations
                    </p>
                    <div className="inline-flex flex-col gap-3">
                      <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">What you'll get:</p>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> ATS Score</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Keyword Analysis</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Skill Gaps</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Improvement Tips</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyzeResume
