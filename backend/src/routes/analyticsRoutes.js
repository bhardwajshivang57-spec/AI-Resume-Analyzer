import express from 'express'
import {
  getDashboardStats,
  getUserStats,
  getAggregateStats,
} from '../controllers/analyticsController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/dashboard', authMiddleware, getDashboardStats)
router.get('/user-stats', authMiddleware, getUserStats)
router.get('/aggregate', authMiddleware, adminMiddleware, getAggregateStats)

export default router
