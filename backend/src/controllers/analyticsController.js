import Resume from '../models/Resume.js'
import User from '../models/User.js'
import Analytics from '../models/Analytics.js'

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId

    const resumes = await Resume.find({ userId })
    const avgScore = resumes.length > 0
      ? Math.round(resumes.reduce((acc, r) => acc + (r.analysis?.atsScore || 0), 0) / resumes.length)
      : 0

    res.json({
      totalResumes: resumes.length,
      averageATSScore: avgScore,
      recentResumes: resumes.slice(0, 5),
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to get stats', error: error.message })
  }
}

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await User.findById(userId).populate('resumes')
    const resumeCount = user.resumes.length

    res.json({
      userId,
      resumeCount,
      joinDate: user.createdAt,
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user stats', error: error.message })
  }
}

export const getAggregateStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalResumes = await Resume.countDocuments()
    const allResumes = await Resume.find()

    const avgScore = allResumes.length > 0
      ? Math.round(allResumes.reduce((acc, r) => acc + (r.analysis?.atsScore || 0), 0) / allResumes.length)
      : 0

    // Calculate skill gaps
    const skillGaps = {}
    allResumes.forEach(resume => {
      if (resume.analysis?.skillGaps) {
        resume.analysis.skillGaps.forEach(skill => {
          skillGaps[skill] = (skillGaps[skill] || 0) + 1
        })
      }
    })

    const topSkills = Object.entries(skillGaps)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))

    res.json({
      totalUsers,
      totalResumesAnalyzed: totalResumes,
      averageATSScore: avgScore,
      topSkillGaps: topSkills,
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to get aggregate stats', error: error.message })
  }
}
