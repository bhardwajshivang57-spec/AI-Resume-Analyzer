# 🎯 AI Resume Analyzer & Career Recommendation System

A **production-level** AI-powered web application that analyzes resumes, matches them with job descriptions, and provides personalized career recommendations.

## ✨ Features

### Core Features
- 📄 **Resume Upload & Parsing** - Upload PDF/DOCX resumes with AI-powered text extraction
- 🤖 **AI Resume Analysis** - Advanced NLP-based analysis including ATS scoring and skill gaps
- 💼 **Job Matching System** - Match resumes with job descriptions and highlight missing skills
- 🎓 **Smart Recommendations** - ML-based skill recommendations, courses, and career paths
- 📊 **Interactive Dashboard** - Beautiful visualizations of resume strength and progress
- 🔐 **Authentication** - Secure JWT-based login/registration system
- 👨‍💼 **Admin Panel** - Analytics and insights for platform administrators

### Advanced Features
- Dark/Light mode with smooth transitions
- Glassmorphism & Neumorphism design
- Drag-and-drop resume upload
- Real-time progress indicators
- Multi-resume management
- Career path suggestions with salary ranges
- Recommended courses from top platforms
- Detailed improvement tracking

---

## 🏗️ Architecture

```
AI Resume Analyzer/
├── frontend/              # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth & Theme context
│   │   ├── utils/         # API client & helpers
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # Global CSS
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/               # Node.js + Express
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # MongoDB schemas
│   │   ├── middleware/    # Auth & error handling
│   │   ├── config/        # Configuration
│   │   └── utils/         # Helper functions
│   ├── uploads/           # Resume storage
│   ├── package.json
│   └── .env.example
│
├── ai-service/            # Python + FastAPI
│   ├── main.py           # FastAPI app
│   ├── routes.py         # API endpoints
│   ├── nlp_utils.py      # NLP logic
│   ├── config.py         # Configuration
│   ├── requirements.txt
│   └── .env.example
│
└── README.md             # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ (for frontend & backend)
- **Python** 3.8+ (for AI service)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 1️⃣ Clone & Setup

```bash
cd "C:\Users\Shivang57\Desktop\websites\6\AI Resume Analyzer"
```

### 2️⃣ Setup Frontend

```bash
cd frontend

# Copy environment variables
copy .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3️⃣ Setup Backend

```bash
cd ../backend

# Copy environment variables
copy .env.example .env

# Install dependencies
npm install

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 4️⃣ Setup AI Service

```bash
cd ../ai-service

# Copy environment variables
copy .env.example .env

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start AI service
python main.py
```

AI Service will run on `http://localhost:8000`

---

## 📋 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

### Backend (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
AI_SERVICE_URL=http://localhost:8000
UPLOAD_DIR=./uploads
```

**For Production MongoDB (Atlas):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-resume-analyzer
```

### AI Service (`.env`)
```env
DEBUG=True
HOST=0.0.0.0
PORT=8000
BACKEND_URL=http://localhost:5000
```

---

## 🔧 Database Setup

### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB:
   ```bash
   mongod
   ```
3. Create database and collections (auto-created by mongoose)

### Option B: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string and update `.env`

---

## 🌐 API Routes

### Authentication
```
POST   /auth/register          # User registration
POST   /auth/login              # User login
GET    /auth/profile            # Get current user profile
POST   /auth/logout             # User logout
```

### Resume Management
```
POST   /resume/upload           # Upload resume (multipart)
POST   /resume/analyze/:id      # Analyze resume
GET    /resume/analysis/:id     # Get analysis results
GET    /resume/user-resumes     # Get user's resumes
DELETE /resume/:id              # Delete resume
POST   /resume/:id/compare-job  # Compare with job description
```

### Job Matching
```
POST   /matching/get-matches    # Get job matches
POST   /matching/score/:id      # Score against job
```

### Recommendations
```
GET    /recommendations/:id           # Get recommendations
GET    /recommendations/skill-gaps/:id # Get skill gaps
POST   /recommendations/courses       # Get course recommendations
GET    /recommendations/career-paths/:id # Get career paths
```

### Analytics
```
GET    /analytics/dashboard     # User dashboard stats
GET    /analytics/user-stats    # User statistics
GET    /analytics/aggregate     # Platform aggregates (admin only)
```

---

## 🧪 Sample Test Data

### Demo Login Credentials
```
Email: demo@example.com
Password: demo123
Role: user
```

### Admin Credentials
```
Email: admin@example.com
Password: admin123
Role: admin
```

Create these users by registering via the frontend or directly in MongoDB.

---

## 📊 Database Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ("user" | "admin"),
  resumes: [ObjectId],
  savedRecommendations: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Resume
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  fileName: String,
  fileUrl: String,
  parsedData: {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: [{ title, company, duration, description }],
    education: [{ degree, institution, year }],
    projects: [{ name, description, technologies }],
    summary: String
  },
  analysis: {
    atsScore: Number (0-100),
    keywordMatch: Number,
    skillGaps: [String],
    suggestions: [String],
    grammarIssues: [String],
    strengths: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics
```javascript
{
  _id: ObjectId,
  date: Date,
  totalUsers: Number,
  totalResumesAnalyzed: Number,
  averageATSScore: Number,
  topSkillGaps: [{ skill: String, count: Number }],
  userGrowth: [{ month: String, users: Number }],
  createdAt: Date
}
```

---

## 🎨 Frontend Components

### Pages
- **Home** - Landing page with features showcase
- **Login/Register** - Authentication pages
- **Dashboard** - Resume management and stats
- **Analyze Resume** - Upload and analyze resumes
- **Job Matcher** - Match resume with job descriptions
- **Recommendations** - Skills, courses, and career paths
- **Admin Panel** - Analytics and platform stats

### Key Components
- `Navbar` - Top navigation with theme toggle
- `ProtectedRoute` - Authentication wrapper
- `ResumeUploader` - Drag-drop file upload
- `ScoreRing` - Circular progress indicator
- `SkillBadges` - Skill tags display
- `AnalysisCard` - Analysis results container

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Password Hashing** - bcryptjs for secure password storage
✅ **CORS Protection** - Cross-Origin Resource Sharing configured
✅ **Role-Based Access** - Admin and user role differentiation
✅ **File Upload Validation** - Only PDF and DOCX allowed
✅ **Environment Variables** - Sensitive data in `.env`
✅ **Error Handling** - Secure error messages

---

## 📱 Tech Stack Overview

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart library
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin support

### AI Service
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **spaCy** - NLP library
- **scikit-learn** - ML algorithms
- **Pydantic** - Data validation

---

## 🚀 Deployment Guide

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy 'dist' folder to Vercel
```

### Backend (Heroku)
```bash
cd backend
# Install Heroku CLI
heroku create your-app-name
git push heroku main
```

### AI Service (Render/Railway)
```bash
cd ai-service
# Connect Git repo to Render/Railway
# Set environment variables
# Deploy
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running locally or update MONGODB_URI
Check: mongosh command in terminal
```

### Port Already in Use
```
# Change port in .env or kill process
# Frontend: npm run dev --port 3001
# Backend: Update PORT in .env
# AI Service: Update PORT in .env
```

### CORS Errors
```
Solution: Check API_URL in frontend .env matches backend PORT
Ensure backend has CORS enabled
```

### Module Not Found
```
Solution: Run npm install in both frontend and backend
For Python: pip install -r requirements.txt
```

---

## 📈 Performance Optimization

- **Code Splitting** - Lazy load React components
- **Image Optimization** - Compressed assets
- **Caching** - Browser caching via headers
- **Database Indexing** - Indexed fields in MongoDB
- **API Pagination** - Limit query results

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📝 License

MIT License - feel free to use this project

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review API documentation
3. Check console logs for errors
4. Verify environment variables

---

## 🎯 Future Enhancements

- [ ] Video interview preparation assistant
- [ ] LinkedIn profile optimization
- [ ] Salary negotiation guide
- [ ] Portfolio builder integration
- [ ] Real-time chat with HR consultants
- [ ] Advanced NLP with BERT/GPT models
- [ ] Resume template builder
- [ ] Interview scheduling system
- [ ] Company research integration
- [ ] Industry benchmark analytics

---

## ⭐ Key Highlights

✨ **Production-Ready** - Clean code, error handling, logging
✨ **Scalable Architecture** - Microservices separation
✨ **Beautiful UI** - Modern design with animations
✨ **Full Stack** - Complete end-to-end solution
✨ **Well Documented** - Clear setup and API docs
✨ **Best Practices** - Security, performance, maintainability

---

**Built with ❤️ for your career success!**
