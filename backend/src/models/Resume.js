import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    parsedData: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
        },
      ],
      summary: String,
    },
    analysis: {
      atsScore: {
        type: Number,
        default: 0,
      },
      keywordMatch: {
        type: Number,
        default: 0,
      },
      skillGaps: [String],
      suggestions: [String],
      grammarIssues: [String],
      strengths: [String],
      improvementScore: {
        type: Number,
        default: 0,
      },
    },
    jobMatches: [
      {
        jobTitle: String,
        company: String,
        matchScore: Number,
        matchedSkills: [String],
        missingSkills: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Resume', resumeSchema)
