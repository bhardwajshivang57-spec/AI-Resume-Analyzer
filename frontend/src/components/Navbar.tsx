import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 glass dark:glass-dark border-b border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
              AI
            </div>
            <span className="text-sm sm:text-lg lg:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hidden sm:inline">
              Resume Analyzer
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/analyze" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors">
                  Analyze
                </Link>
                <Link to="/job-matcher" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors">
                  Matcher
                </Link>
                <Link to="/recommendations" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors">
                  Tips
                </Link>
                <Link to="/compare" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors">
                  Compare
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                    <LayoutDashboard size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}
              </>
            ) : null}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg text-primary hover:bg-primary/10 transition-colors"
                >
                  <LogOut size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-xs sm:text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-xs sm:text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-700"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 space-y-2"
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/analyze"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Analyze
                </Link>
                <Link
                  to="/job-matcher"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Job Matcher
                </Link>
                <Link
                  to="/recommendations"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recommendations
                </Link>
                <Link
                  to="/compare"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Compare
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : null}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
