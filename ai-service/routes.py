from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from nlp_utils import ResumeParser, ResumeAnalyzer
import os

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """Analyze resume and return feedback"""
    try:
        # Read file content
        content = await file.read()
        if file.content_type == 'application/pdf':
            # Simple text extraction (in production, use pdfplumber or similar)
            text = content.decode('utf-8', errors='ignore')
        elif file.content_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']:
            # Simple extraction (in production, use python-docx)
            text = content.decode('utf-8', errors='ignore')
        else:
            text = content.decode('utf-8', errors='ignore')
        
        # Parse resume
        email = ResumeParser.extract_email(text)
        phone = ResumeParser.extract_phone(text)
        skills = ResumeParser.extract_skills(text)
        experience = ResumeParser.extract_experience(text)
        education = ResumeParser.extract_education(text)
        
        resume_data = {
            'email': email,
            'phone': phone,
            'skills': skills,
            'experience': experience,
            'education': education,
        }
        
        # Analyze resume
        ats_score = ResumeAnalyzer.calculate_ats_score(resume_data)
        
        # Calculate keyword match based on skills and content quality
        keyword_match = 40  # base
        if skills and len(skills) > 0:
            keyword_match += min(len(skills) * 3, 30)
        if experience and len(experience) > 0:
            keyword_match += min(len(experience) * 5, 20)
        keyword_match = min(keyword_match, 100)
        
        skill_gaps = ResumeAnalyzer.detect_skill_gaps(skills, [
            'Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Terraform'
        ])
        suggestions = ResumeAnalyzer.get_suggestions(resume_data)
        grammar_issues = ResumeAnalyzer.detect_grammar_issues(text)
        
        analysis = {
            'atsScore': int(ats_score),
            'keywordMatch': int(keyword_match),
            'skillGaps': skill_gaps,
            'suggestions': suggestions,
            'grammarIssues': grammar_issues,
            'strengths': [
                f'Found {len(skills)} technical skills' if skills else 'Add more technical skills',
                f'Listed {len(experience)} work experiences' if experience else 'Add work experience',
                'Professional formatting' if len(text) > 200 else 'Improve formatting'
            ]
        }
        
        return JSONResponse({
            'status': 'success',
            'analysis': analysis,
            'parsed_data': resume_data
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare-job")
async def compare_with_job(resume_text: str, job_description: str):
    """Compare resume with job description"""
    try:
        result = ResumeAnalyzer.check_keywords(resume_text, job_description)
        
        return JSONResponse({
            'status': 'success',
            'match_percentage': result['match_percentage'],
            'matched_count': result['matched_count'],
            'total_keywords': result['total_keywords']
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-skills")
async def extract_skills(text: str):
    """Extract skills from text"""
    try:
        skills = ResumeParser.extract_skills(text)
        return JSONResponse({
            'status': 'success',
            'skills': skills
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/get-recommendations")
async def get_recommendations(skills: list, job_title: str = None):
    """Get skill recommendations based on skills"""
    try:
        # Simple recommendation logic
        recommendations = {
            'skills_to_learn': ['Kubernetes', 'Docker', 'AWS'],
            'courses': [
                {'title': 'Kubernetes Mastery', 'platform': 'Udemy'},
                {'title': 'AWS Certification', 'platform': 'A Cloud Guru'}
            ],
            'projects': [
                'Build a microservices application',
                'Deploy an app to Kubernetes'
            ]
        }
        
        return JSONResponse({
            'status': 'success',
            'recommendations': recommendations
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse({
        'status': 'healthy',
        'service': 'AI Resume Analyzer Service'
    })
