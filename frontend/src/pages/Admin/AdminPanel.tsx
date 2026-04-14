import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { motion } from 'framer-motion'
import { Users, FileText, TrendingUp } from 'lucide-react'
import { analyticsAPI } from '../../utils/api'

const AdminPanel = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      // Use dummy data for demo
      setStats({
        totalUsers: 1250,
        totalResumesAnalyzed: 5430,
        averageATSScore: 72,
        skillGaps: [
          { skill: 'Kubernetes', count: 320 },
          { skill: 'AWS', count: 280 },
          { skill: 'Docker', count: 250 },
          { skill: 'Terraform', count: 180 },
          { skill: 'CI/CD', count: 160 }
        ],
        userGrowth: [
          { month: 'Jan', users: 400 },
          { month: 'Feb', users: 520 },
          { month: 'Mar', users: 680 },
          { month: 'Apr', users: 890 },
          { month: 'May', users: 1050 },
          { month: 'Jun', users: 1250 }
        ]
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#3b82f6']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8">Platform analytics and insights</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {[
            { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'primary' },
            { title: 'Resumes Analyzed', value: stats.totalResumesAnalyzed, icon: FileText, color: 'secondary' },
            { title: 'Avg ATS Score', value: `${stats.averageATSScore}%`, icon: TrendingUp, color: 'accent' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {metric.title}
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold break-words">{metric.value}</div>
                </div>
                <metric.icon className={`w-10 h-10 sm:w-12 sm:h-12 text-${metric.color} flex-shrink-0`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-12">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-4"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-6">User Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skill Gaps Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-4"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-6">Top Skill Gaps</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.skillGaps}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ skill, count }) => `${skill} (${count})`}
                  outerRadius={75}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.skillGaps.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Skill Gap Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card p-4"
        >
          <h2 className="text-lg sm:text-xl font-bold mb-6">Most Common Skill Gaps</h2>
          <div className="space-y-4">
            {stats.skillGaps.map((gap: any, index: number) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-dark-800">
                <span className="font-medium text-sm sm:text-base">{gap.skill}</span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-1 sm:w-40 lg:w-48 bg-gray-200 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary"
                      style={{ width: `${(gap.count / 320) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 w-10 sm:w-12 text-right">
                    {gap.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminPanel
