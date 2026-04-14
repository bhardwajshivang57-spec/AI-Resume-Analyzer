# 🌐 Deployment Guide

## Prerequisites
- Git repository (GitHub, GitLab, etc.)
- Vercel account (frontend)
- Heroku/Railway account (backend)
- MongoDB Atlas (database)
- Render/Railway account (AI service)

---

## 🔧 Pre-Deployment Checklist

### Code Preparation
- [ ] Update MONGODB_URI to MongoDB Atlas
- [ ] Change JWT_SECRET to strong key
- [ ] Set NODE_ENV=production
- [ ] Remove console.logs
- [ ] Test all features locally
- [ ] Update API URLs if needed
- [ ] Add environment variables to hosting

### Security
- [ ] No secrets in code
- [ ] Passwords hashed
- [ ] CORS configured correctly
- [ ] File uploads validated
- [ ] Error messages safe

### Performance
- [ ] Frontend optimized (npm run build)
- [ ] Database indexes added
- [ ] Images optimized
- [ ] Caching enabled

---

## 🚀 Frontend Deployment (Vercel)

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts to configure project
```

### Option 2: Using GitHub/GitLab

1. Push code to GitHub:
   ```bash
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import repository

5. Configure:
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`

6. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.herokuapp.com/api
   VITE_AI_SERVICE_URL=https://your-ai-service.onrender.com
   ```

7. Deploy

### Post-Deployment
- [ ] Test all pages load
- [ ] Check API calls working
- [ ] Test authentication
- [ ] Verify dark mode
- [ ] Test on mobile

---

## 🔧 Backend Deployment (Heroku)

### Prerequisites
- Install Heroku CLI
- GitHub repository

### Step 1: Update Configuration

Create `src/config/index.js` environment detection:

```javascript
export const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-analyzer',
  JWT_SECRET: process.env.JWT_SECRET || 'change-in-production',
  NODE_ENV: process.env.NODE_ENV || 'development',
}
```

### Step 2: Add Procfile

Create file: `backend/Procfile`
```
web: node src/server.js
```

### Step 3: Update package.json

```json
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### Step 4: Deploy

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-resume-analyzer
heroku config:set JWT_SECRET=your-strong-secret-key
heroku config:set NODE_ENV=production
heroku config:set AI_SERVICE_URL=https://your-ai-service.onrender.com

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Check status
heroku ps
```

### Post-Deployment
- [ ] Check logs for errors
- [ ] Test health endpoint
- [ ] Verify database connection
- [ ] Test API endpoints

---

## 🐍 AI Service Deployment (Render)

### Step 1: Prepare Repository

Ensure `ai-service/` has:
- `main.py`
- `requirements.txt`
- `.env` template

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)

2. Click "New +"

3. Select "Web Service"

4. Connect GitHub account and select repository

5. Configure:
   - **Name:** `ai-resume-analyzer`
   - **Environment:** Python 3.11
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Root Directory:** `ai-service`

6. Add Environment Variables:
   ```
   DEBUG=False
   HOST=0.0.0.0
   PORT=8000
   BACKEND_URL=https://your-backend.herokuapp.com
   ```

7. Deploy

### Alternative: Railway.app

1. Go to [railway.app](https://railway.app)

2. Click "Create New Project"

3. Select "GitHub Repo"

4. Configure similar to above

---

## 🗄️ MongoDB Atlas Setup

### Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

2. Sign up/Login

3. Create Organization

4. Create Project

5. Create Cluster:
   - Select "Shared"
   - Choose region
   - Create

### Create Database User

1. Go to "Database Access"

2. Add Database User:
   - Set username: `admin`
   - Set password: Strong password
   - Add User

3. Copy connection string

### Create IP Whitelist

1. Go to "Network Access"

2. Add IP Address:
   - For development: `0.0.0.0/0` (allow all)
   - For production: Specific IPs

### Connection String

Format:
```
mongodb+srv://username:password@cluster.mongodb.net/database-name
```

Use in `.env`:
```
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/ai-resume-analyzer
```

---

## 🔐 Environment Variables by Service

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend.herokuapp.com/api
VITE_AI_SERVICE_URL=https://your-ai-service.onrender.com
```

### Heroku (Backend)
```
PORT=5000
MONGODB_URI=mongodb+srv://admin:pass@cluster.mongodb.net/ai-resume-analyzer
JWT_SECRET=change-this-to-very-long-random-string
JWT_EXPIRE=7d
NODE_ENV=production
AI_SERVICE_URL=https://your-ai-service.onrender.com
UPLOAD_DIR=./uploads
```

### Render (AI Service)
```
DEBUG=False
HOST=0.0.0.0
PORT=8000
BACKEND_URL=https://your-backend.herokuapp.com
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Auto-Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: your-app-name
          appdir: backend/
```

---

## ✅ Post-Deployment Testing

### 1. Frontend
```bash
# Test homepage loads
curl https://your-frontend.vercel.app

# Test dark mode toggle
# Test login flow
# Test file upload
# Test all pages
```

### 2. Backend
```bash
# Test health check
curl https://your-backend.herokuapp.com/health

# Test API endpoints
curl https://your-backend.herokuapp.com/auth/profile \
  -H "Authorization: Bearer <token>"

# Test database connection
# Check logs for errors
```

### 3. AI Service
```bash
# Test health
curl https://your-ai-service.onrender.com/health

# Test analysis endpoint
# Check documentation at /docs
```

---

## 🐛 Troubleshooting

### Frontend Issues

**Build fails:**
```
Solution: Check Node version, clear cache
rm -rf node_modules dist
npm install
npm run build
```

**API calls return 404:**
```
Solution: Update VITE_API_URL in .env
Double-check backend is running
```

### Backend Issues

**Database connection fails:**
```
Solution: Check MongoDB URI
Verify IP whitelist includes Heroku IPs
Check credentials
```

**Port already in use:**
```
Solution: Heroku assigns PORT automatically
Don't hardcode PORT in production
```

### AI Service Issues

**Module import errors:**
```
Solution: Verify requirements.txt
Check Python version (3.8+)
pip install -r requirements.txt
```

**Slow responses:**
```
Solution: Add caching
Optimize NLP models
Monitor CPU usage
```

---

## 📊 Monitoring & Logging

### Heroku Logs
```bash
# View logs
heroku logs --tail

# Search for errors
heroku logs | grep ERROR

# View specific dyno
heroku logs --dyno web.1
```

### Render Logs
```bash
View in Render dashboard
Settings > Logs
```

### Vercel Logs
```bash
View in Vercel dashboard
Deployments > Logs
```

### MongoDB
```bash
Monitoring in Atlas dashboard
Real-time metrics available
Performance Advisor
```

---

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MongoDB user has limited permissions
- [ ] CORS only allows trusted origins
- [ ] HTTPS enabled everywhere
- [ ] Environment variables not in code
- [ ] File uploads validated
- [ ] Rate limiting enabled (optional)
- [ ] Logs don't contain sensitive data
- [ ] Database backups enabled
- [ ] Regular security updates

---

## 📈 Performance Optimization

### Frontend
```bash
# Build analysis
npm run build
# Check bundle size in dist/

# Optimize images
# Update cache headers
# Enable gzip compression on CDN
```

### Backend
```javascript
// Add Redis caching
// Index database fields
// Implement rate limiting
// Use connection pooling
```

### Database
```
// Create indexes on frequently queried fields
db.resumes.createIndex({ userId: 1 })
db.resumes.createIndex({ createdAt: -1 })
```

---

## 💰 Cost Estimates (Monthly)

| Service | Free Plan | Paid Plan | Notes |
|---------|-----------|-----------|-------|
| Vercel | ✅ | $20+ | Free for hobby |
| Heroku | ❌ | $7+ | Minimum dyno |
| Render | ✅ | $7+ | Free tier available |
| MongoDB Atlas | ✅ | $9+ | Free cluster with limits |
| Total | $0+ | $23-50 | Varies by usage |

---

## 🚀 Production Checklist

Pre-Launch:
- [ ] All tests pass
- [ ] Documentation complete
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Error reporting configured
- [ ] Support plan ready

Post-Launch:
- [ ] Monitor performance
- [ ] Check user feedback
- [ ] Update documentation
- [ ] Plan enhancements
- [ ] Regular backups
- [ ] Security updates

---

## 📞 Support

### Deployment Resources
- Vercel Docs: https://vercel.com/docs
- Heroku Docs: https://devcenter.heroku.com
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

### Debugging
- Check service logs
- Verify environment variables
- Test API endpoints manually
- Review error messages
- Check FireWall settings

---

## 🎉 You're Live!

Once deployed, your application is available globally:

- **Frontend:** https://your-frontend.vercel.app
- **Backend:** https://your-backend.herokuapp.com
- **AI Service:** https://your-ai-service.onrender.com

Share the links and watch the traffic grow! 🚀

---

*Last Updated: January 2024*
