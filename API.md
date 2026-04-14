# API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Authentication Routes

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "resumes": ["607f1f77bcf86cd799439012"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 2. Resume Routes

#### Upload Resume
```http
POST /resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <PDF or DOCX file>
```

**Response (201):**
```json
{
  "message": "Resume uploaded successfully",
  "resumeId": "607f1f77bcf86cd799439012",
  "resume": {
    "_id": "607f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "fileName": "John_Doe_Resume.pdf",
    "fileUrl": "/uploads/resume-1234567890.pdf",
    "parsedData": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": [],
      "education": [],
      "projects": []
    },
    "analysis": {},
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Analyze Resume
```http
POST /resume/analyze/607f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Resume analyzed successfully",
  "analysis": {
    "atsScore": 78,
    "keywordMatch": 82,
    "skillGaps": ["Kubernetes", "Docker", "AWS"],
    "suggestions": [
      "Add more quantifiable achievements",
      "Include more technical keywords"
    ],
    "grammarIssues": [],
    "strengths": ["Strong technical skills", "Good experience"],
    "improvementScore": 0
  }
}
```

#### Get Analysis Results
```http
GET /resume/analysis/607f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "atsScore": 78,
  "keywordMatch": 82,
  "skillGaps": ["Kubernetes", "Docker"],
  "suggestions": ["Add more skills"],
  "grammarIssues": [],
  "strengths": ["Strong skills"]
}
```

#### Get User Resumes
```http
GET /resume/user-resumes
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "resumes": [
    {
      "_id": "607f1f77bcf86cd799439012",
      "fileName": "John_Doe_Resume.pdf",
      "atsScore": 78,
      "uploadedAt": "2024-01-15T10:30:00Z",
      "parsedData": { ... }
    }
  ]
}
```

#### Delete Resume
```http
DELETE /resume/607f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Resume deleted successfully"
}
```

#### Compare Resume with Job
```http
POST /resume/607f1f77bcf86cd799439012/compare-job
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobDescription": "We are looking for a senior developer with 5+ years experience in JavaScript, React, and Node.js..."
}
```

**Response (200):**
```json
{
  "matchScore": 85,
  "matchedSkills": ["JavaScript", "React", "Node.js"],
  "missingSkills": ["Kubernetes", "Docker"],
  "recommendations": [
    "Highlight matching skills in your cover letter",
    "Add missing technical keywords"
  ]
}
```

---

### 3. Job Matching Routes

#### Get Matches
```http
POST /matching/get-matches
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobDescriptions": [
    "Senior Developer role requiring JavaScript, React, AWS..."
  ]
}
```

**Response (200):**
```json
{
  "matches": [
    {
      "title": "Senior Developer",
      "company": "Tech Corp",
      "matchScore": 82,
      "matchedSkills": ["JavaScript", "React"],
      "missingSkills": ["AWS", "Docker"],
      "recommendations": ["Learn AWS", "Gain Docker experience"]
    }
  ]
}
```

#### Score Job
```http
POST /matching/score/607f1f77bcf86cd799439012
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobDescription": "Looking for experienced React developer..."
}
```

**Response (200):**
```json
{
  "score": 88,
  "matchedSkills": ["React", "JavaScript"],
  "missingSkills": ["TypeScript", "GraphQL"]
}
```

---

### 4. Recommendations Routes

#### Get Recommendations
```http
GET /recommendations/607f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "skillsToLearn": [
    {
      "skill": "Kubernetes",
      "relevance": 95,
      "resources": ["Udemy", "Linux Academy"]
    }
  ],
  "projects": [
    "Build a microservices application"
  ]
}
```

#### Get Skill Gaps
```http
GET /recommendations/skill-gaps/607f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "critical": ["Kubernetes", "AWS"],
  "important": ["CI/CD", "Docker"],
  "nice_to_have": ["GraphQL", "gRPC"]
}
```

#### Get Courses
```http
POST /recommendations/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "skills": ["Kubernetes", "Docker", "AWS"]
}
```

**Response (200):**
```json
{
  "courses": [
    {
      "id": "1",
      "title": "Kubernetes Mastery",
      "platform": "Udemy",
      "duration": "22 hours",
      "level": "Advanced",
      "rating": 4.8
    }
  ]
}
```

#### Get Career Paths
```http
GET /recommendations/career-paths/607f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "careerPaths": [
    {
      "title": "Senior DevOps Engineer",
      "description": "Lead infrastructure and automation",
      "yearsToAchieve": 3,
      "requiredSkills": ["Kubernetes", "Terraform", "AWS"],
      "salaryRange": "$150K - $200K"
    }
  ]
}
```

---

### 5. Analytics Routes

#### Get Dashboard Stats
```http
GET /analytics/dashboard
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalResumes": 5,
  "averageATSScore": 76,
  "recentResumes": [...]
}
```

#### Get User Stats
```http
GET /analytics/user-stats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "resumeCount": 5,
  "joinDate": "2024-01-01T00:00:00Z"
}
```

#### Get Aggregate Stats (Admin Only)
```http
GET /analytics/aggregate
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "totalUsers": 1250,
  "totalResumesAnalyzed": 5430,
  "averageATSScore": 72,
  "topSkillGaps": [
    {
      "skill": "Kubernetes",
      "count": 320
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Resume not found"
}
```

### 409 Conflict
```json
{
  "message": "Email already registered"
}
```

### 500 Server Error
```json
{
  "message": "Internal Server Error",
  "error": "Detailed error message"
}
```

---

## Rate Limiting
Currently not implemented. Consider adding for production.

## Pagination
Not implemented. Add limit and skip parameters for large datasets.

## Caching
Consider implementing Redis caching for frequently accessed data.
