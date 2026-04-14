import express from 'express'
import { getMatches, scoreJob } from '../controllers/matchingController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/get-matches', authMiddleware, getMatches)
router.post('/score/:resumeId', authMiddleware, scoreJob)

export default router
