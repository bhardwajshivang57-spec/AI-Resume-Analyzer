from typing import List, Dict
import re
import string

class ResumeParser:
    """Parse and extract structured data from resume text"""
    
    @staticmethod
    def extract_email(text: str) -> str:
        """Extract email from text"""
        pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        matches = re.findall(pattern, text)
        return matches[0] if matches else None
    
    @staticmethod
    def extract_phone(text: str) -> str:
        """Extract phone number from text"""
        pattern = r'(?:\+?1[-.\s]?)?\(?(?:[0-9]{3})\)?[-.\s]?(?:[0-9]{3})[-.\s]?(?:[0-9]{4})'
        matches = re.findall(pattern, text)
        return matches[0] if matches else None
    
    @staticmethod
    def extract_skills(text: str) -> List[str]:
        """Extract skills from text"""
        common_skills = [
            'python', 'javascript', 'java', 'csharp', 'cpp', 'golang', 'rust',
            'react', 'vue', 'angular', 'nodejs', 'express', 'django', 'fastapi',
            'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
            'git', 'linux', 'windows', 'machine learning', 'deep learning',
            'tensorflow', 'pytorch', 'scikit-learn', 'nltk', 'spacy',
            'rest api', 'graphql', 'microservices', 'ci/cd', 'devops'
        ]
        
        text_lower = text.lower()
        found_skills = []
        
        for skill in common_skills:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        return list(set(found_skills))
    
    @staticmethod
    def extract_experience(text: str) -> List[Dict]:
        """Extract work experience from text"""
        # Simplified extraction
        experience = []
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in ['experience', 'work', 'employment']):
                # Simple extraction - in production use NER models
                if i + 1 < len(lines):
                    experience.append({
                        'title': lines[i + 1] if i + 1 < len(lines) else '',
                        'company': lines[i + 2] if i + 2 < len(lines) else '',
                        'duration': lines[i + 3] if i + 3 < len(lines) else '',
                        'description': ''
                    })
        
        return experience
    
    @staticmethod
    def extract_education(text: str) -> List[Dict]:
        """Extract education from text"""
        education = []
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in ['education', 'degree', 'bachelor', 'master', 'phd']):
                if i + 1 < len(lines):
                    education.append({
                        'degree': lines[i + 1] if i + 1 < len(lines) else '',
                        'institution': lines[i + 2] if i + 2 < len(lines) else '',
                        'year': lines[i + 3] if i + 3 < len(lines) else ''
                    })
        
        return education

class ResumeAnalyzer:
    """Analyze resume quality and provide feedback"""
    
    @staticmethod
    def calculate_ats_score(resume_data: Dict) -> float:
        """Calculate ATS-friendly score (0-100)"""
        score = 50  # base score
        
        # Factor in different components with varying weights
        if resume_data.get('email'):
            score += 10
        if resume_data.get('phone'):
            score += 10
        
        # Skills score - more skills = higher score
        skills = resume_data.get('skills', [])
        if skills and len(skills) > 0:
            skill_score = min(len(skills) * 2, 20)  # 2 points per skill, max 20
            score += skill_score
        
        # Experience score - more experience = higher score
        experience = resume_data.get('experience', [])
        if experience and len(experience) > 0:
            exp_score = min(len(experience) * 8, 25)  # 8 points per job, max 25
            score += exp_score
        
        # Education score
        education = resume_data.get('education', [])
        if education and len(education) > 0:
            edu_score = min(len(education) * 5, 15)
            score += edu_score
        
        return min(max(score, 0), 100)
    
    @staticmethod
    def detect_skill_gaps(resume_skills: List[str], target_skills: List[str]) -> List[str]:
        """Detect missing skills"""
        resume_skills_lower = [s.lower() for s in resume_skills]
        gaps = []
        
        for skill in target_skills:
            if skill.lower() not in resume_skills_lower:
                gaps.append(skill)
        
        return gaps
    
    @staticmethod
    def get_suggestions(resume_data: Dict) -> List[str]:
        """Generate improvement suggestions based on actual resume content"""
        suggestions = []
        
        # Contact information suggestions
        if not resume_data.get('email'):
            suggestions.append("Add your email address for recruiters to contact you")
        if not resume_data.get('phone'):
            suggestions.append("Include your phone number for better accessibility")
        
        # Skills suggestions
        skills = resume_data.get('skills', [])
        if not skills or len(skills) == 0:
            suggestions.append("Add technical skills to make your resume discoverable")
        elif len(skills) < 5:
            suggestions.append(f"You have {len(skills)} skills - consider adding 3-5 more relevant skills")
        else:
            suggestions.append(f"Great! You have {len(skills)} technical skills listed")
        
        # Experience suggestions
        experience = resume_data.get('experience', [])
        if not experience or len(experience) == 0:
            suggestions.append("List your work experience with achievements and impact metrics")
        elif len(experience) < 2:
            suggestions.append("Consider adding more work experience entries to strengthen your profile")
        else:
            suggestions.append(f"Good! You have {len(experience)} positions - add impact numbers to each role")
        
        # Education suggestions
        education = resume_data.get('education', [])
        if not education or len(education) == 0:
            suggestions.append("Add your educational background and certifications")
        else:
            suggestions.append(f"You have {len(education)} educational qualification(s) - ensure all are current")
        
        # Format suggestions based on skills quality
        if skills:
            tech_skills = [s for s in skills if any(tech in s.lower() for tech in 
                          ['python', 'java', 'javascript', 'react', 'aws', 'docker', 'kubernetes', 'sql'])]
            if not tech_skills:
                suggestions.append("Add specific technologies and frameworks you know well")
        
        return suggestions
    
    @staticmethod
    def check_keywords(resume_text: str, job_description: str) -> Dict:
        """Check keyword match between resume and job description"""
        resume_words = set(resume_text.lower().split())
        job_words = set(job_description.lower().split())
        
        matched_keywords = resume_words.intersection(job_words)
        match_percentage = (len(matched_keywords) / len(job_words)) * 100 if job_words else 0
        
        return {
            'match_percentage': min(match_percentage, 100),
            'matched_count': len(matched_keywords),
            'total_keywords': len(job_words)
        }
    
    @staticmethod
    def detect_grammar_issues(text: str) -> List[str]:
        """Basic grammar issue detection"""
        issues = []
        
        # Check for common grammar issues
        if '  ' in text:  # double spaces
            issues.append("Remove double spaces throughout the document")
        
        # Check sentence starters
        lines = text.split('\n')
        for line in lines:
            if line and not line[0].isupper():
                issues.append(f"Capitalize the beginning of sentences: {line[:30]}...")
                break
        
        return issues
