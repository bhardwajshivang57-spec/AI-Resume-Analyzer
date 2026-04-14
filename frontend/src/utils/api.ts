import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  profile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
}

export const resumeAPI = {
  upload: (formData: FormData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  analyze: (resumeId: string) => api.post(`/resume/analyze/${resumeId}`),
  getAnalysis: (resumeId: string) => api.get(`/resume/analysis/${resumeId}`),
  getUserResumes: () => api.get('/resume/user-resumes'),
  deleteResume: (resumeId: string) => api.delete(`/resume/${resumeId}`),
  compareWithJob: (resumeId: string, jobDescription: string) => 
    api.post(`/resume/${resumeId}/compare-job`, { jobDescription }),
}

export const matchingAPI = {
  getMatches: (jobDescriptions: string[]) => 
    api.post('/matching/get-matches', { jobDescriptions }),
  scoreJob: (resumeId: string, jobDescription: string) => 
    api.post(`/matching/score/${resumeId}`, { jobDescription }),
}

export const recommendationAPI = {
  getRecommendations: (resumeId: string) => 
    api.get(`/recommendations/${resumeId}`),
  getSkillGaps: (resumeId: string) => 
    api.get(`/recommendations/skill-gaps/${resumeId}`),
  getCourses: (skills: string[]) => 
    api.post('/recommendations/courses', { skills }),
  getCareerPaths: (resumeId: string) => 
    api.get(`/recommendations/career-paths/${resumeId}`),
}

export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getUserStats: () => api.get('/analytics/user-stats'),
  getAggregateStats: () => api.get('/analytics/aggregate'),
}

export default api
