import { BarChart3, TrendingUp, Zap, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Resume Analysis',
      description: 'AI-powered analysis of your resume with detailed feedback'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Job Matching',
      description: 'Match your resume with job descriptions instantly'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Smart Recommendations',
      description: 'Get personalized career paths and skill recommendations'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely'
    }
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 left-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Transform Your<br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Resume with AI
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get instant feedback, ATS optimization, and personalized career recommendations. Powered by advanced AI and machine learning.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {isAuthenticated ? (
              <>
                <Link to="/analyze" className="btn-primary">
                  Analyze Your Resume
                </Link>
                <Link to="/dashboard" className="btn-secondary">
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto text-xs sm:text-sm">
            <div className="card p-3 sm:p-4">
              <div className="text-lg sm:text-2xl font-bold text-primary">10K+</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Happy Users</div>
            </div>
            <div className="card p-3 sm:p-4">
              <div className="text-lg sm:text-2xl font-bold text-primary">50K+</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Resumes Analyzed</div>
            </div>
            <div className="card p-3 sm:p-4">
              <div className="text-lg sm:text-2xl font-bold text-primary">95%</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to optimize your resume and advance your career
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-4 sm:p-6"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {['Upload Your Resume', 'Get AI Analysis', 'Receive Recommendations', 'Improve & Succeed'].map(
              (step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 sm:gap-4 card p-4 sm:p-6"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold shrink-0 text-sm sm:text-base">
                    {index + 1}
                  </div>
                  <h3 className="text-base sm:text-xl font-bold">{step}</h3>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center card-glass p-6 sm:p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Optimize Your Career?</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            Join thousands of professionals who have improved their resumes and landed their dream jobs.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary inline-block text-sm sm:text-base">
              Start Your Free Analysis
            </Link>
          )}
        </motion.div>
      </section>
    </div>
  )
}

export default Home
