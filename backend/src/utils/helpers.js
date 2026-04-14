import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { config } from '../config/index.js'

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  )
}

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

export const parseResume = (text) => {
  // Basic resume parsing logic
  const lines = text.split('\n')
  
  const resume = {
    name: null,
    email: null,
    phone: null,
    skills: [],
    experience: [],
    education: [],
    projects: [],
    summary: null,
  }

  // Simple extraction (in production, use more sophisticated NLP)
  for (const line of lines) {
    if (line.includes('@')) {
      resume.email = line.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0]
    }
    if (line.match(/\d{3}-\d{3}-\d{4}/)) {
      resume.phone = line.match(/\d{3}-\d{3}-\d{4}/)?.[0]
    }
    if (line.match(/skills|expertise|technical/i)) {
      resume.skills.push(...line.split(/[,;]/).filter(s => s.trim()))
    }
  }

  return resume
}

export const calculateATSScore = (resume) => {
  let score = 50 // base score

  // Add points for different factors
  if (resume.skills?.length > 0) score += 10
  if (resume.experience?.length > 0) score += 15
  if (resume.education?.length > 0) score += 10
  if (resume.email) score += 5
  if (resume.phone) score += 5
  if (resume.summary) score += 5

  return Math.min(score, 100)
}
