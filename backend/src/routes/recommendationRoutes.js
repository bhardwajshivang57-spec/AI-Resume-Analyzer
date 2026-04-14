import express from 'express'
import {
  getRecommendations,
  getSkillGaps,
  getCourses,
  getCareerPaths,
} from '../controllers/recommendationController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/:resumeId', authMiddleware, getRecommendations)
router.get('/skill-gaps/:resumeId', authMiddleware, getSkillGaps)
router.post('/courses', authMiddleware, getCourses)
router.get('/career-paths/:resumeId', authMiddleware, getCareerPaths)

export default router
