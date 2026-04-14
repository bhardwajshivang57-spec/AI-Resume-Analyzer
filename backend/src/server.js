import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { config } from './config/index.js'
import { errorHandler } from './middleware/auth.js'
import authRoutes from './routes/authRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js'
import matchingRoutes from './routes/matchingRoutes.js'
import recommendationRoutes from './routes/recommendationRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('uploads'))

// Database Connection
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/matching', matchingRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use('/api/analytics', analyticsRoutes)

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error Handler
app.use(errorHandler)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start Server
const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
  console.log(`✓ Environment: ${config.NODE_ENV}`)
})

export default app
