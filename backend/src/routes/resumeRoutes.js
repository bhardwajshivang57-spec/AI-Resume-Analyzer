import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  uploadResume,
  analyzeResume,
  getAnalysis,
  getUserResumes,
  deleteResume,
  compareWithJob,
} from '../controllers/resumeController.js'
import { authMiddleware } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx|doc/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'))
    }
  },
})

const router = express.Router()

router.post('/upload', authMiddleware, upload.single('file'), uploadResume)
router.post('/analyze/:resumeId', authMiddleware, analyzeResume)
router.get('/analysis/:resumeId', authMiddleware, getAnalysis)
router.get('/user-resumes', authMiddleware, getUserResumes)
router.delete('/:resumeId', authMiddleware, deleteResume)
router.post('/:resumeId/compare-job', authMiddleware, compareWithJob)

export default router
