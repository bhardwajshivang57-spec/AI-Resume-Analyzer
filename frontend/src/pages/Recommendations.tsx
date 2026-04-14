import { useState, useEffect } from 'react'
import { BookOpen, Briefcase, Zap, FileText, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { recommendationAPI, resumeAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'

interface Resume {
  _id: string
  fileName: string
  parsedData: {
    name: string
    skills: string[]
  }
}

interface SkillRecommendation {
  skill: string
  relevance: number
  resources: string[]
}

interface CareerPath {
  title: string
  description: string
  yearsToAchieve: number
  requiredSkills: string[]
  salaryRange: string
}

interface Course {
  id: string
  title: string
  platform: string
  duration: string
  level: string
  rating: number
}

interface SkillGaps {
  critical: string[]
  important: string[]
  nice_to_have: string[]
}

const Recommendations = () => {
  const { isAuthenticated } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [skillRecommendations, setSkillRecommendations] = useState<SkillRecommendation[]>([])
  const [skillGaps, setSkillGaps] = useState<SkillGaps | null>(null)
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      
      if (userResumes.length > 0) {
        setSelectedResumeId(userResumes[0]._id)
      }
    } catch (err) {
      setError('Failed to load your resumes.')
      console.error('Error fetching resumes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedResumeId) {
      fetchRecommendations()
    }
  }, [selectedResumeId])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Fetch all recommendation data in parallel
      const [recsResponse, gapsResponse, pathsResponse] = await Promise.all([
        recommendationAPI.getRecommendations(selectedResumeId),
        recommendationAPI.getSkillGaps(selectedResumeId),
        recommendationAPI.getCareerPaths(selectedResumeId)
      ])

      const skillsToLearn = recsResponse.data.skillsToLearn || []
      setSkillRecommendations(skillsToLearn)
      
      setSkillGaps(gapsResponse.data)
      setCareerPaths(pathsResponse.data.careerPaths || [])

      // Fetch courses for the critical skills
      const criticalSkills = gapsResponse.data.critical || []
      if (criticalSkills.length > 0) {
        try {
          const coursesResponse = await recommendationAPI.getCourses(criticalSkills.slice(0, 3))
          setCourses(coursesResponse.data.courses || [])
        } catch (courseError) {
          console.error('Failed to fetch courses:', courseError)
          setCourses([])
        }
      }
    } catch (error) {
      setError('Failed to fetch recommendations. Please try again.')
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && resumes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your recommendations...</p>
        </div>
      </div>
    )
  }

  if (resumes.length === 0 && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card-glass text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Resumes Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Please upload a resume first to get personalized recommendations</p>
            <a href="/analyze-resume" className="btn-primary inline-block">
              Upload Resume
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Career Recommendations</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            Personalized learning paths and career growth opportunities based on your resume
          </p>

          {/* Resume Selector */}
          {resumes.length > 1 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <label className="text-xs sm:text-sm font-semibold">Select Resume:</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full sm:w-auto p-2 sm:p-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-dark-900 dark:text-white text-xs sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.parsedData?.name || resume.fileName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

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
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading recommendations...</p>
          </div>
        ) : (
          <>
            {/* Skill Gaps Overview */}
            {skillGaps && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mb-12"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  Skill Gaps Analysis
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Critical Skills */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="card border border-red-200 dark:border-red-900 p-4"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mb-4">
                      Critical Skills ({skillGaps.critical.length})
                    </h3>
                    <div className="space-y-2">
                      {skillGaps.critical.length > 0 ? (
                        skillGaps.critical.map((skill, i) => (
                          <span
                            key={i}
                            className="block px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs sm:text-sm font-medium"
                          >
                            • {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">No critical skill gaps found</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Important Skills */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="card border border-orange-200 dark:border-orange-900 p-4"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400 mb-4">
                      Important Skills ({skillGaps.important.length})
                    </h3>
                    <div className="space-y-2">
                      {skillGaps.important.length > 0 ? (
                        skillGaps.important.map((skill, i) => (
                          <span
                            key={i}
                            className="block px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-xs sm:text-sm font-medium"
                          >
                            • {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">No important skill gaps found</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Nice to Have */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="card border border-blue-200 dark:border-blue-900 p-4"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      Nice to Have ({skillGaps.nice_to_have.length})
                    </h3>
                    <div className="space-y-2">
                      {skillGaps.nice_to_have.length > 0 ? (
                        skillGaps.nice_to_have.map((skill, i) => (
                          <span
                            key={i}
                            className="block px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs sm:text-sm font-medium"
                          >
                            • {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">No nice to have skills identified</p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Skills to Learn */}
            {skillRecommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-12"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Top Skills to Learn
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {skillRecommendations.slice(0, 6).map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="card p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <h3 className="text-base sm:text-lg font-bold flex-1 break-words">{skill.skill}</h3>
                        <span className="text-xs sm:text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded whitespace-nowrap">
                          {skill.relevance}%
                        </span>
                      </div>

                      {/* Relevance Bar */}
                      <div className="relative w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mb-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.relevance}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>

                      {/* Resources */}
                      {skill.resources.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Learning Resources:
                          </p>
                          <div className="space-y-1">
                            {skill.resources.map((resource, i) => (
                              <div key={i} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                • {resource}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Career Paths */}
            {careerPaths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mb-12"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                  Career Growth Paths
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {careerPaths.map((path, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-glass hover:shadow-xl transition-shadow p-4"
                    >
                      <div className="mb-4">
                        <h3 className="text-base sm:text-xl font-bold mb-1">{path.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{path.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Timeline</p>
                          <p className="text-base sm:text-lg font-bold text-primary">{path.yearsToAchieve}y</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Salary</p>
                          <p className="text-base sm:text-lg font-bold text-secondary">{path.salaryRange}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                          Required Skills:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {path.requiredSkills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommended Courses */}
            {courses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  Recommended Courses for Critical Skills
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                      className="card hover:shadow-xl transition-shadow flex flex-col p-4"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base line-clamp-2">{course.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {course.platform}
                          </p>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <div className="text-lg sm:text-xl font-bold text-yellow-500">★</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {course.rating}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-4 text-sm text-gray-600 dark:text-gray-400 flex-1">
                        <p>⏱ {course.duration}</p>
                        <p>📊 {course.level}</p>
                      </div>

                      <button className="btn-primary w-full text-sm mt-auto">
                        Explore Course
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {skillRecommendations.length === 0 && careerPaths.length === 0 && courses.length === 0 && (
              <div className="card-glass text-center py-16">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No recommendations available at this time</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

export default Recommendations

