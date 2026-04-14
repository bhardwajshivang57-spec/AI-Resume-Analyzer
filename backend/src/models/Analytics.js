import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
    totalResumesAnalyzed: {
      type: Number,
      default: 0,
    },
    averageATSScore: {
      type: Number,
      default: 0,
    },
    topSkillGaps: [
      {
        skill: String,
        count: Number,
      },
    ],
    userGrowth: [
      {
        month: String,
        users: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Analytics', analyticsSchema)
