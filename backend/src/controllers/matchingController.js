import Resume from '../models/Resume.js'

export const getMatches = async (req, res) => {
  try {
    const { jobDescriptions } = req.body
    const userId = req.user.userId

    // Fetch user's latest resume
    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 })
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' })
    }

    const matches = jobDescriptions.map(jobDesc => {
      const resumeSkills = resume.parsedData.skills || []
      const matchedSkills = resumeSkills.filter(skill =>
        jobDesc.toLowerCase().includes(skill.toLowerCase())
      )

      return {
        title: 'Software Engineer',
        company: 'Tech Company',
        matchScore: Math.round((matchedSkills.length / Math.max(resumeSkills.length, 1)) * 100),
        matchedSkills,
        missingSkills: resumeSkills.filter(s => !matchedSkills.includes(s)),
        recommendations: [
          'Emphasize your matched skills',
          'Consider learning the missing skills',
          'Customize your resume for this role',
        ],
      }
    })

    res.json({ matches })
  } catch (error) {
    res.status(500).json({ message: 'Matching failed', error: error.message })
  }
}

export const scoreJob = async (req, res) => {
  try {
    const { resumeId } = req.params
    const { jobDescription } = req.body
    const userId = req.user.userId

    const resume = await Resume.findById(resumeId)
    if (!resume || resume.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    const resumeSkills = resume.parsedData.skills || []
    const jobKeywords = jobDescription.toLowerCase().split(/\s+/)

    const matchedSkills = resumeSkills.filter(skill =>
      jobDescription.toLowerCase().includes(skill.toLowerCase())
    )

    const score = Math.round((matchedSkills.length / Math.max(resumeSkills.length, 1)) * 100)

    res.json({
      score,
      matchedSkills,
      missingSkills: resumeSkills.filter(s => !matchedSkills.includes(s)),
    })
  } catch (error) {
    res.status(500).json({ message: 'Scoring failed', error: error.message })
  }
}
