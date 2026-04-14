# 🚀 Step-by-Step Setup Guide

## ⚡ 5-Minute Quick Start

### 1. Start All Services

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 2. Access Application
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- AI Service: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## 📋 Detailed Frontend Setup

### 1. Install Node.js
Visit [nodejs.org](https://nodejs.org/) and install LTS version

### 2. Navigate to Frontend
```bash
cd "C:\Users\Shivang57\Desktop\websites\6\AI Resume Analyzer\frontend"
```

### 3. Create Environment File
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### 4. Edit `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

### 5. Install Dependencies
```bash
npm install
```

This installs:
- React 18
- Vite (build tool)
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- React Router

### 6. Start Development Server
```bash
npm run dev
```

Output:
```
VITE v4.3.9  ready in 345 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

### 7. Build for Production
```bash
npm run build
```

Creates optimized `dist/` folder for deployment

### 8. Preview Production Build
```bash
npm run preview
```

---

## 🔧 Detailed Backend Setup

### 1. Install Node.js
Already done in frontend setup

### 2. Install MongoDB

**Option A: Windows**
- Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Run installer
- Start service:
  ```bash
  mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Create free account
- Create cluster
- Get connection string

### 3. Navigate to Backend
```bash
cd ../backend
```

### 4. Create Environment File
```bash
copy .env.example .env
```

### 5. Edit `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=change-this-in-production-use-random-string
JWT_EXPIRE=7d
NODE_ENV=development
AI_SERVICE_URL=http://localhost:8000
UPLOAD_DIR=./uploads
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-resume-analyzer
```

### 6. Install Dependencies
```bash
npm install
```

Installs:
- Express (web framework)
- Mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- Multer (file upload)
- Axios (HTTP client)
- CORS

### 7. Start Backend
```bash
npm run dev
```

Output:
```
✓ Server running on http://localhost:5000
✓ Environment: development
✓ MongoDB connected
```

### 8. Verify Backend
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🐍 Detailed AI Service Setup

### 1. Install Python
Visit [python.org](https://python.org/) and download Python 3.8+

Verify installation:
```bash
python --version
```

### 2. Navigate to AI Service
```bash
cd ../ai-service
```

### 3. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in terminal prompt

### 4. Create Environment File
```bash
copy .env.example .env

# Or on Mac/Linux
cp .env.example .env
```

### 5. Edit `.env`
```env
DEBUG=True
HOST=0.0.0.0
PORT=8000
BACKEND_URL=http://localhost:5000
```

### 6. Install Python Dependencies
```bash
pip install -r requirements.txt
```

Installs:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- spaCy (NLP)
- scikit-learn (ML)
- Pydantic (data validation)
- python-docx (DOCX parsing)
- PyPDF2 (PDF parsing)

### 7. Download spaCy Model (Optional)
```bash
python -m spacy download en_core_web_sm
```

### 8. Start AI Service
```bash
python main.py
```

Output:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 9. Test AI Service
Visit: `http://localhost:8000/docs`

---

## 🗄️ MongoDB Setup

### Create Sample Data

Open MongoDB Compass or mongosh:

```javascript
// Switch to ai-resume-analyzer database
use ai-resume-analyzer

// Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // bcrypt hash
  role: "admin",
  resumes: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// Create demo user
db.users.insertOne({
  name: "Demo User",
  email: "demo@example.com",
  password: "$2a$10$...", // bcrypt hash
  role: "user",
  resumes: [],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Verify Collections Created
Collections auto-created on first use:
- `users`
- `resumes`
- `analytics`

---

## 🧪 Testing the Application

### 1. Register New User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

Copy the returned `token`

### 3. Upload Resume
```bash
curl -X POST http://localhost:5000/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@resume.pdf"
```

### 4. Check Frontend
- Navigate to `http://localhost:3000`
- Register or login
- Upload a resume
- See analysis results
- Explore all features

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
npm install
```

### Issue: "MongoDB connection refused"
**Solution:**
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Use different port
npm run dev --port 3001
```

### Issue: "Python: No module named 'fastapi'"
**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: CORS errors
**Solution:**
- Verify API_URL in frontend .env
- Check backend CORS settings
- Ensure all services are running

### Issue: "venv command not found"
**Solution:**
```bash
# Use python3 instead
python3 -m venv venv
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running or connected to Atlas
- [ ] Python installed (`python --version`)
- [ ] Frontend running on port 3000
- [ ] Backend running on port 5000
- [ ] AI Service running on port 8000
- [ ] Can access frontend dashboard
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can upload resume
- [ ] Backend health check passes
- [ ] AI service API docs accessible

---

## 📁 File Structure Check

Verify all directories exist:

```
AI Resume Analyzer/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── .env
├── ai-service/
│   ├── venv/
│   ├── main.py
│   ├── routes.py
│   ├── requirements.txt
│   └── .env
└── README.md
```

---

## 🚀 Next Steps

1. **Explore Features:**
   - Upload a test resume
   - Analyze it
   - Check job matching
   - View recommendations

2. **Customize:**
   - Update styling in Tailwind config
   - Modify API responses
   - Add more skill detection

3. **Deploy:**
   - Frontend to Vercel
   - Backend to Heroku/Railway
   - AI Service to Render

4. **Scale:**
   - Add Redis caching
   - Implement rate limiting
   - Add database indexing
   - Set up monitoring

---

## 💡 Tips

- Keep all three terminals open during development
- Check browser console and terminal logs for errors
- Use MongoDB Compass for viewing data
- Use VS Code REST Client for API testing
- Enable hot reload for faster development

---

## 📞 Need Help?

1. Check troubleshooting section above
2. Review logs in each terminal
3. Verify environment variables
4. Ensure all ports are different
5. Check firewall settings if needed

**Enjoy building! 🎉**
