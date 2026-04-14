# 🚀 Quick Deployment Guide

## ⚡ Fastest Way: Railway.app (Recommended - All 3 Services in One Place)

### Step 1: Create Railway Account
Go to [railway.app](https://railway.app) and sign up

### Step 2: Connect GitHub
- Click "New Project"
- Select "Deploy from GitHub"
- Select your `AI-Resume-Analyzer` repo

### Step 3: Configure Services
Railway will auto-detect 3 services. Configure each:

#### **Frontend Service**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Start Command: `npm run preview`

#### **Backend Service**
- Root Directory: `backend`
- Build Command: (leave empty)
- Start Command: `npm start`
- Environment Variables:
  ```
  NODE_ENV=production
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_strong_secret_key
  AI_SERVICE_URL=https://your-ai-service-url
  ```

#### **AI Service**
- Root Directory: `ai-service`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port 8000`
- Environment Variables:
  ```
  DEBUG=False
  BACKEND_URL=https://your-backend-url
  ```

### Step 4: Deploy!
Click "Deploy" and Railway handles everything.

---

## Alternative: Vercel (Frontend) + Heroku (Backend) + Render (AI)

### Frontend → Vercel
```bash
cd frontend
npm run build
# Go to vercel.com → New Project → Import from GitHub
# Root Directory: frontend
# Build: npm run build
# Output: dist
```

### Backend → Heroku
```bash
# Install Heroku CLI
heroku login
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### AI Service → Render
```bash
# Go to render.com → New Web Service
# Connect GitHub repo
# Root Directory: ai-service
# Build Command: pip install -r requirements.txt
# Start Command: uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 📊 Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-resume-analyzer
JWT_SECRET=min-32-chars-strong-secret-key
NODE_ENV=production
AI_SERVICE_URL=https://your-ai-service.onrender.com
```

### AI Service (.env)
```
DEBUG=False
BACKEND_URL=https://your-backend.herokuapp.com
```

### Frontend (Build Variable in Vercel/Railway)
```
VITE_API_URL=https://your-backend.herokuapp.com/api
VITE_AI_SERVICE_URL=https://your-ai-service.onrender.com
```

---

## ✅ Pre-Deployment Checklist

- [ ] `runtime.txt` with `python-3.10.13` (Done ✓)
- [ ] `Procfile` in backend (Done ✓)
- [ ] `.env.example` files created (Done ✓)
- [ ] MongoDB Atlas cluster created
- [ ] GitHub repo up to date (push latest)
- [ ] All credentials ready (MongoDB, JWT secret)

---

## 🔗 Useful Links

- [Railway.app](https://railway.app) - Recommended
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database
- [Vercel](https://vercel.com) - Frontend
- [Heroku](https://heroku.com) - Backend
- [Render](https://render.com) - AI Service
