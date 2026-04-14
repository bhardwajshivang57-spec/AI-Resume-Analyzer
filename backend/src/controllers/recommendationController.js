import Resume from '../models/Resume.js'

export const getRecommendations = async (req, res) => {
  try {
    const { resumeId } = req.params
    const userId = req.user.userId

    const resume = await Resume.findById(resumeId)
    if (!resume || resume.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    const recommendations = {
      skillsToLearn: [
        { skill: 'Kubernetes', relevance: 95, resources: ['Udemy', 'Linux Academy'] },
        { skill: 'AWS', relevance: 90, resources: ['AWS Training', 'A Cloud Guru'] },
        { skill: 'Docker', relevance: 85, resources: ['Docker Docs', 'Udemy'] },
      ],
      projects: [
        'Build a microservices application',
        'Deploy an app to Kubernetes',
        'Set up CI/CD pipeline',
      ],
    }

    res.json(recommendations)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recommendations', error: error.message })
  }
}

export const getSkillGaps = async (req, res) => {
  try {
    const { resumeId } = req.params
    const userId = req.user.userId

    const resume = await Resume.findById(resumeId)
    if (!resume || resume.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    const skillGaps = {
      critical: ['Kubernetes', 'AWS', 'Docker'],
      important: ['CI/CD', 'Terraform'],
      nice_to_have: ['GraphQL', 'Rust'],
    }

    res.json(skillGaps)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get skill gaps', error: error.message })
  }
}

export const getCourses = async (req, res) => {
  try {
    const { skills } = req.body

    const courses = [
      {
        id: '1',
        title: 'Kubernetes Mastery',
        platform: 'Udemy',
        duration: '22 hours',
        level: 'Advanced',
        rating: 4.8,
      },
      {
        id: '2',
        title: 'AWS Certified Solutions Architect',
        platform: 'A Cloud Guru',
        duration: '40 hours',
        level: 'Advanced',
        rating: 4.7,
      },
      {
        id: '3',
        title: 'Docker & Kubernetes',
        platform: 'Coursera',
        duration: '30 hours',
        level: 'Intermediate',
        rating: 4.6,
      },
    ]

    res.json({ courses })
  } catch (error) {
    res.status(500).json({ message: 'Failed to get courses', error: error.message })
  }
}

export const getCareerPaths = async (req, res) => {
  try {
    const { resumeId } = req.params
    const userId = req.user.userId

    const resume = await Resume.findById(resumeId)
    if (!resume || resume.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    const careerPaths = [
      {
        title: 'Senior DevOps Engineer',
        description: 'Lead infrastructure and automation',
        yearsToAchieve: 3,
        requiredSkills: ['Kubernetes', 'Terraform', 'AWS'],
        salaryRange: '$150K - $200K',
      },
      {
        title: 'Cloud Solutions Architect',
        description: 'Design scalable cloud solutions',
        yearsToAchieve: 5,
        requiredSkills: ['AWS', 'System Design'],
        salaryRange: '$160K - $220K',
      },
    ]

    res.json({ careerPaths })
  } catch (error) {
    res.status(500).json({ message: 'Failed to get career paths', error: error.message })
  }
}
