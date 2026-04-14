# 📖 Quick Reference Guide

## 🎯 Project Overview

**AI Resume Analyzer & Career Recommendation System** is a full-stack web application built with modern technologies. It provides AI-powered resume analysis, job matching, and personalized career recommendations.

### Tech Stack at a Glance
- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + MongoDB + JWT
- **AI Service:** Python + FastAPI + spaCy
- **Database:** MongoDB (local or Atlas)

---

## 🚀 Quick Start Commands

### One-Time Setup
```bash
# Navigate to project
cd "C:\Users\Shivang57\Desktop\websites\6\AI Resume Analyzer"

# Frontend setup
cd frontend && npm install && copy .env.example .env && cd ..

# Backend setup
cd backend && npm install && copy .env.example .env && cd ..

# AI Service setup
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Daily Development (3 Terminal Windows)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
# Navigate to http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
# Activate venv first: venv\Scripts\activate
python main.py
# Running on http://localhost:8000
```

---

## 📁 Project Structure

```
AI Resume Analyzer/
│
├── frontend/
│   ├── src/
│   │   ├── components/       → Reusable React components
│   │   ├── pages/            → Page components (Home, Dashboard, etc.)
│   │   ├── context/          → Auth & Theme context
│   │   ├── utils/            → API client, helpers
│   │   ├── hooks/            → Custom React hooks
│   │   ├── styles/           → Global CSS
│   │   ├── App.tsx           → Main app component
│   │   └── main.tsx          → Entry point
│   ├── public/               → Static files
│   ├── index.html            → HTML entry point
│   ├── vite.config.js        → Build configuration
│   ├── tailwind.config.js    → Tailwind configuration
│   ├── package.json          → Dependencies
│   └── .env.example          → Environment variables
│
├── backend/
│   ├── src/
│   │   ├── routes/           → API endpoint definitions
│   │   ├── controllers/      → Business logic
│   │   ├── models/           → MongoDB schemas
│   │   ├── middleware/       → Auth, error handling
│   │   ├── config/           → Configuration
│   │   ├── utils/            → Helper functions
│   │   └── server.js         → Express app setup
│   ├── uploads/              → Resume file storage
│   ├── package.json          → Dependencies
│   └── .env.example          → Environment variables
│
├── ai-service/
│   ├── main.py               → FastAPI app
│   ├── routes.py             → API endpoints
│   ├── nlp_utils.py          → NLP functions
│   ├── config.py             → Configuration
│   ├── requirements.txt      → Python dependencies
│   └── .env.example          → Environment variables
│
├── README.md                 → Main documentation
├── SETUP.md                  → Setup instructions
├── API.md                    → API documentation
└── QUICK_REFERENCE.md        → This file
```

---

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
AI_SERVICE_URL=http://localhost:8000
UPLOAD_DIR=./uploads
```

### AI Service (.env)
```env
DEBUG=True
HOST=0.0.0.0
PORT=8000
BACKEND_URL=http://localhost:5000
```

---

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `http://localhost:3000` | React app UI |
| Backend | `http://localhost:5000` | Express API |
| AI Service | `http://localhost:8000` | Python NLP API |
| API Docs | `http://localhost:8000/docs` | Swagger/OpenAPI |
| MongoDB | `localhost:27017` | Database |

---

## 📚 Available Routes

### Frontend Pages
```
/ → Home page
/login → Login page
/register → Registration page
/dashboard → User dashboard
/analyze → Resume upload & analysis
/job-matcher → Job matching
/recommendations → Career recommendations
/admin → Admin panel (admin only)
```

### Backend API Endpoints
```
POST   /auth/register
POST   /auth/login
GET    /auth/profile
POST   /auth/logout

POST   /resume/upload
POST   /resume/analyze/:id
GET    /resume/analysis/:id
GET    /resume/user-resumes
DELETE /resume/:id
POST   /resume/:id/compare-job

POST   /matching/get-matches
POST   /matching/score/:id

GET    /recommendations/:id
GET    /recommendations/skill-gaps/:id
POST   /recommendations/courses
GET    /recommendations/career-paths/:id

GET    /analytics/dashboard
GET    /analytics/user-stats
GET    /analytics/aggregate (admin)
```

### AI Service Endpoints
```
POST /analyze → Analyze resume file
POST /compare-job → Compare resume with job
POST /extract-skills → Extract skills from text
POST /get-recommendations → Get skill recommendations
GET  /health → Health check
GET  /docs → API documentation
```

---

## 🔐 Authentication

### Flow
1. User registers with email & password
2. Backend hashes password with bcryptjs
3. JWT token generated
4. Token sent to frontend, stored in localStorage
5. Token included in all API requests (`Authorization: Bearer <token>`)
6. Backend verifies token on protected routes

### Test Credentials
```
Email: demo@example.com
Password: demo123
```

---

## 🧪 Testing the Application

### 1. Test Registration
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

### 2. Test Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Test Resume Upload
```bash
# First get token from login
curl -X POST http://localhost:5000/resume/upload \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@resume.pdf"
```

### 4. Test Frontend
- Go to `http://localhost:3000`
- Register new account
- Upload a resume
- View analysis
- Check recommendations

---

## 🐛 Debugging

### Check Logs
- **Frontend:** Browser DevTools (F12)
- **Backend:** Terminal running `npm run dev`
- **AI Service:** Terminal running `python main.py`

### MongoDB
```bash
# Start MongoDB
mongod

# Or use MongoDB Compass for GUI
# Download: https://www.mongodb.com/products/compass
```

### Common Errors

| Error | Solution |
|-------|----------|
| Port already in use | Kill process or use different port |
| MongoDB connection failed | Start MongoDB or update connection string |
| CORS error | Check API_URL in frontend .env |
| Module not found | Run `npm install` or `pip install -r requirements.txt` |
| venv not in PATH | Use `python -m venv venv` |

---

## 📊 Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (bcrypt hash),
  role: "user" | "admin",
  resumes: [ObjectId],
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
    name, email, phone, skills: [], experience: [], education: [], projects: []
  },
  analysis: {
    atsScore: Number,
    skillGaps: [],
    suggestions: [],
    strengths: []
  },
  createdAt: Date
}
```

---

## 🎨 Frontend Features

### Pages
- **Home** - Landing page with features
- **Auth** - Login/Register pages
- **Dashboard** - Resume management
- **Analyze** - Resume upload & analysis
- **Job Matcher** - Job description matching
- **Recommendations** - Skills & career paths
- **Admin** - Platform analytics

### Components
- Navbar with theme toggle
- Protected route component
- Resume upload (drag-drop)
- Analysis cards
- Score visualizations
- Skill badges

### Styling
- Tailwind CSS for styling
- Framer Motion for animations
- Dark/Light mode support
- Responsive design
- Glassmorphism effects

---

## ⚙️ Backend Features

### Controllers
- **authController** - Register, login, profile
- **resumeController** - Upload, analyze, compare
- **matchingController** - Job matching logic
- **recommendationController** - Skill suggestions
- **analyticsController** - Stats & metrics

### Middleware
- JWT authentication
- Error handling
- CORS configuration
- File upload validation

### Models
- User (auth & management)
- Resume (storage & analysis)
- Analytics (metrics)

---

## 🐍 AI Service Features

### Functions
- **ResumeParser** - Extract data from resumes
- **ResumeAnalyzer** - Calculate scores & detect issues
- Keyword matching
- Skill gap detection
- Grammar checking
- Recommendations

### NLP Capabilities
- Email/phone extraction
- Skill recognition
- Experience extraction
- Education parsing
- Text analysis

---

## 🚀 Deployment Checklist

### Before Deploying
- [ ] Update JWT_SECRET with strong key
- [ ] Use MongoDB Atlas (not local)
- [ ] Set NODE_ENV=production
- [ ] Optimize frontend build
- [ ] Test all features
- [ ] Set up environment variables on hosting
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Create database backups

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy 'dist' folder to Vercel
```

### Backend Deployment (Heroku)
```bash
cd backend
heroku create app-name
git push heroku main
```

### AI Service (Render)
```bash
# Connect repository to Render
# Set environment variables
# Deploy
```

---

## 📈 Performance Tips

1. **Frontend**
   - Lazy load components
   - Optimize images
   - Enable caching
   - Minify CSS/JS

2. **Backend**
   - Add database indexes
   - Use caching (Redis)
   - Implement rate limiting
   - Connection pooling

3. **Database**
   - Index frequently queried fields
   - Regular backups
   - Monitor slow queries

4. **Deployment**
   - Use CDN for static files
   - Enable gzip compression
   - Set up auto-scaling
   - Monitor performance

---

## 🎓 Learning Resources

### Frontend
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

### Backend
- [Express.js](https://expressjs.com)
- [Mongoose](https://mongoosejs.com)
- [JWT](https://jwt.io)

### AI/ML
- [FastAPI](https://fastapi.tiangolo.com)
- [spaCy](https://spacy.io)
- [scikit-learn](https://scikit-learn.org)

### Database
- [MongoDB](https://mongodb.com/docs)

---

## 💡 Pro Tips

1. **Development**
   - Use VS Code with REST Client extension
   - Enable Prettier for formatting
   - Use React DevTools
   - Check browser console regularly

2. **Testing**
   - Test each endpoint with curl
   - Verify database changes
   - Check both success & error cases
   - Test on mobile

3. **Debugging**
   - Add console.logs strategically
   - Use debugger in DevTools
   - Check network tab
   - Monitor API responses

4. **Security**
   - Never commit .env files
   - Use strong JWT secret
   - Validate all inputs
   - Hash passwords properly
   - Use HTTPS in production

---

## 🆘 Getting Help

1. **Error in console?**
   - Read error message carefully
   - Check file names and paths
   - Verify environment variables

2. **API not working?**
   - Check Network tab in DevTools
   - Verify backend is running
   - Check API URL in .env
   - Use `/docs` for API testing

3. **Database issues?**
   - Verify MongoDB is running
   - Check connection string
   - Use MongoDB Compass
   - Check firewall settings

4. **Still stuck?**
   - Review setup guide
   - Check API documentation
   - Look at code comments
   - Check GitHub issues

---

## 📞 Support

For detailed help:
- See **README.md** for overview
- See **SETUP.md** for detailed setup
- See **API.md** for API documentation
- Check code comments for implementation details

---

## ✨ Next Steps

1. ✅ Complete setup
2. ✅ Test all features
3. ✅ Customize styling
4. ✅ Add more features
5. ✅ Deploy to production

---

**Happy coding! 🚀**

*Last updated: January 2024*
