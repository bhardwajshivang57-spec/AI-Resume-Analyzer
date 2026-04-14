import Resume from '../models/Resume.js'
import User from '../models/User.js'
import { v4 as uuidv4 } from 'uuid'
import { parseResume, calculateATSScore } from '../utils/helpers.js'
import axios from 'axios'
import { config } from '../config/index.js'
import fs from 'fs'
import FormData from 'form-data'

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const userId = req.user.userId
    const fileUrl = `/uploads/${req.file.filename}`

    // Send file to AI service for parsing
    let parsedData = {
      name: 'Resume Owner',
      email: '',
      phone: '',
      skills: [],
      experience: [],
      education: [],
      projects: [],
      summary: 'Professional resume',
    }

    try {
      const formData = new FormData()
      const fileStream = fs.createReadStream(req.file.path)
      formData.append('file', fileStream, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      })

      const aiResponse = await axios.post(
        `${config.AI_SERVICE_URL}/analyze`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      )

      if (aiResponse.data?.parsed_data) {
        parsedData = aiResponse.data.parsed_data
      }
    } catch (aiError) {
      console.log('AI service parsing failed:', aiError.message)
      // Continue with basic parsing
      try {
        const fileContent = fs.readFileSync(req.file.path, 'utf-8')
        
        // Extract basic info from file
        const emailMatch = fileContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
        const phoneMatch = fileContent.match(/(?:\+?1[-.\s]?)?\(?(?:[0-9]{3})\)?[-.\s]?(?:[0-9]{3})[-.\s]?(?:[0-9]{4})/)
        
        if (emailMatch) parsedData.email = emailMatch[0]
        if (phoneMatch) parsedData.phone = phoneMatch[0]
        
        // Look for skills
        const skillPatterns = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'MongoDB', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'Express', 'Vue', 'Angular']
        parsedData.skills = skillPatterns.filter(skill => fileContent.toLowerCase().includes(skill.toLowerCase()))
        
        // Look for experience keywords
        const hasExperience = fileContent.toLowerCase().includes('experience') || fileContent.toLowerCase().includes('work')
        if (hasExperience) {
          parsedData.experience = [{
            title: 'Professional Experience',
            company: 'Your Company',
            duration: 'Current',
            description: 'See file for details'
          }]
        }
        
        // Look for education keywords
        const hasEducation = fileContent.toLowerCase().includes('education') || fileContent.toLowerCase().includes('degree')
        if (hasEducation) {
          parsedData.education = [{
            degree: 'Education Found',
            institution: 'Your Institution',
            year: 'See file for details'
          }]
        }
      } catch (e) {
        console.log('Local parsing also failed:', e.message)
      }
    }

    const resume = new Resume({
      userId,
      fileName: req.file.originalname,
      fileUrl,
      parsedData,
    })

    await resume.save()

    // Add resume to user
    await User.findByIdAndUpdate(userId, {
      $push: { resumes: resume._id },
    })

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      resume,
    })
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message })
  }
}

export const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.params
    const userId = req.user.userId

    const resume = await Resume.findById(resumeId)
    if (!resume || resume.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    // Generate analysis based on parsed data
    const parsedData = resume.parsedData || {}
    let analysis = {
      atsScore: 50,
      keywordMatch: 50,
      skillGaps: [],
      suggestions: [],
      grammarIssues: [],
      strengths: [],
    }

    // Try to get analysis from AI service
    try {
      const aiResponse = await axios.post(`${config.AI_SERVICE_URL}/analyze`, {
        parsedData: parsedData,
        fileContent: resume.fileName,
      })

      if (aiResponse.data?.analysis) {
        analysis = aiResponse.data.analysis
      }
    } catch (aiError) {
      console.log('AI service analysis failed, calculating locally')

      // Local analysis calculation
      const skills = parsedData.skills || []
      const experience = parsedData.experience || []
      const education = parsedData.education || []
      const email = parsedData.email || ''
      const phone = parsedData.phone || ''

      // Calculate ATS score
      let atsScore = 50
      if (email) atsScore += 10
      if (phone) atsScore += 10
      if (skills.length > 0) atsScore += Math.min(skills.length * 2, 20)
      if (experience.length > 0) atsScore += Math.min(experience.length * 8, 25)
      if (education.length > 0) atsScore += Math.min(education.length * 5, 15)

      // Calculate keyword match
      let keywordMatch = 40
      if (skills.length > 5) keywordMatch += 20
      if (experience.length > 3) keywordMatch += 20
      if (education.length > 0) keywordMatch += 20
      keywordMatch = Math.min(keywordMatch, 100)

      // Generate suggestions
      const suggestions = []
      if (!email) suggestions.push('Add your email address')
      if (!phone) suggestions.push('Add your phone number')
      if (skills.length < 5) suggestions.push(`Add ${5 - skills.length} more skills`)
      if (experience.length === 0) suggestions.push('Add your work experience')
      if (education.length === 0) suggestions.push('Add your educational background')
      if (suggestions.length === 0) suggestions.push('Your resume looks great!')

      // Detect skill gaps
      const industrySkills = [
        'Kubernetes',
        'Docker',
        'AWS',
        'CI/CD',
        'Terraform',
        'React',
        'Python',
        'JavaScript',
      ]
      const skillsLower = (skills || []).map((s) => s.toLowerCase())
      const skillGaps = industrySkills.filter(
        (skill) => !skillsLower.includes(skill.toLowerCase())
      )

      // Identify strengths
      const strengths = []
      if (skills.length > 0) strengths.push(`${skills.length} technical skills`)
      if (experience.length > 0) strengths.push(`${experience.length} work experience${experience.length > 1 ? 's' : ''}`)
      if (education.length > 0) strengths.push('Educational background listed')
      if (strengths.length === 0) strengths.push('Profile setup in progress')

      analysis = {
        atsScore: Math.min(atsScore, 100),
        keywordMatch: Math.min(keywordMatch, 100),
        skillGaps: skillGaps.slice(0, 5),
        suggestions,
        grammarIssues: [],
        strengths,
      }
    }

    resume.analysis = analysis
    await resume.save()

    res.json({
      message: 'Resume analyzed successfully',
      analysis: resume.analysis,
    })
  } catch (error) {
    res.status(500).json({ message: 'Analysis failed', error: error.message })
  }
}

export const getAnalysis = async (req, res) => {
  try {
    const { resumeId } = req.params
    const userId = req.user.userId

    const resume = await Resume.findById(resumeId)
    if (!resume || resume.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    res.json(resume.analysis)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analysis', error: error.message })
  }
}

export const getUserResumes = async (req, res) => {
  try {
    const userId = req.user.userId

    const resumes = await Resume.find({ userId })
      .select('-fileUrl')
      .sort({ createdAt: -1 })

    res.json({
      resumes,
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resumes', error: error.message })
  }
}

export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params
    const userId = req.user.userId

    const resume = await Resume.findById(resumeId)
    if (!resume || resume.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    await Resume.deleteOne({ _id: resumeId })
    await User.findByIdAndUpdate(userId, {
      $pull: { resumes: resumeId },
    })

    res.json({ message: 'Resume deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message })
  }
}

export const compareWithJob = async (req, res) => {
  try {
    const { resumeId } = req.params
    const { jobDescription } = req.body
    const userId = req.user.userId

    const resume = await Resume.findById(resumeId)
    if (!resume || resume.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    // Simple matching logic
    const resumeSkills = resume.parsedData.skills || []
    const jobKeywords = jobDescription
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)

    const matchedSkills = resumeSkills.filter(skill =>
      jobDescription.toLowerCase().includes(skill.toLowerCase())
    )

    const matchScore = Math.round((matchedSkills.length / resumeSkills.length) * 100)

    res.json({
      matchScore,
      matchedSkills,
      missingSkills: resumeSkills.filter(s => !matchedSkills.includes(s)),
      recommendations: [
        'Highlight matching skills in your cover letter',
        'Add missing technical keywords to your resume',
      ],
    })
  } catch (error) {
    res.status(500).json({ message: 'Comparison failed', error: error.message })
  }
}
