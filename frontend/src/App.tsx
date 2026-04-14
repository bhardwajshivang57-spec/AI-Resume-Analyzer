import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AnalyzeResume from './pages/AnalyzeResume'
import JobMatcher from './pages/JobMatcher'
import Recommendations from './pages/Recommendations'
import CompareResumes from './pages/CompareResumes'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import AdminPanel from './pages/Admin/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analyze" element={<AnalyzeResume />} />
                <Route path="/job-matcher" element={<JobMatcher />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/compare" element={<CompareResumes />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
