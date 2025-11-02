from flask import Blueprint, request, jsonify
import jwt
import os
from models import User, QuizResponse
from database import db
from utils.gemini_client import get_career_recommendations

quiz_bp = Blueprint('quiz', __name__)

def verify_token():
    """Verify JWT token and return user"""
    token = request.headers.get('Authorization')
    if not token:
        return None
    
    try:
        token = token.replace('Bearer ', '')
        payload = jwt.decode(token, os.getenv('SECRET_KEY', 'your-secret-key-here'), algorithms=['HS256'])
        user = User.query.get(payload['user_id'])
        return user
    except:
        return None

# RIASEC Quiz Questions
RIASEC_QUESTIONS = [
    {
        "id": 1,
        "question": "I enjoy working with tools and building things",
        "category": "Realistic"
    },
    {
        "id": 2,
        "question": "I like to investigate and solve problems",
        "category": "Investigative"
    },
    {
        "id": 3,
        "question": "I enjoy creating art, music, or writing",
        "category": "Artistic"
    },
    {
        "id": 4,
        "question": "I like helping and teaching others",
        "category": "Social"
    },
    {
        "id": 5,
        "question": "I enjoy leading and managing people",
        "category": "Enterprising"
    },
    {
        "id": 6,
        "question": "I prefer organized and structured work",
        "category": "Conventional"
    },
    {
        "id": 7,
        "question": "I like working outdoors and with my hands",
        "category": "Realistic"
    },
    {
        "id": 8,
        "question": "I enjoy analyzing data and conducting research",
        "category": "Investigative"
    },
    {
        "id": 9,
        "question": "I like expressing myself creatively",
        "category": "Artistic"
    },
    {
        "id": 10,
        "question": "I enjoy working in teams and collaborating",
        "category": "Social"
    }
]

@quiz_bp.route('/quiz', methods=['GET'])
def get_quiz():
    """Get RIASEC quiz questions"""
    return jsonify({
        'questions': RIASEC_QUESTIONS,
        'total': len(RIASEC_QUESTIONS)
    })

@quiz_bp.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    """Submit quiz answers and get career recommendations"""
    try:
        user = verify_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.get_json()
        answers = data.get('answers', {})
        text_response = data.get('text_response', '')
        
        if not answers:
            return jsonify({'error': 'Quiz answers are required'}), 400
        
        # Calculate RIASEC scores
        riasec_scores = {
            'Realistic': 0,
            'Investigative': 0,
            'Artistic': 0,
            'Social': 0,
            'Enterprising': 0,
            'Conventional': 0
        }
        
        for question_id, score in answers.items():
            question_id = int(question_id)
            if 1 <= question_id <= len(RIASEC_QUESTIONS):
                question = RIASEC_QUESTIONS[question_id - 1]
                category = question['category']
                riasec_scores[category] += score
        
        # Get career recommendations from Gemini
        try:
            recommendations = get_career_recommendations(riasec_scores, text_response)
        except Exception as e:
            # Fallback recommendations if Gemini fails
            recommendations = get_fallback_recommendations(riasec_scores)
        
        # Save quiz response
        quiz_response = QuizResponse(
            user_id=user.id,
            text_response=text_response
        )
        quiz_response.set_answers(answers)
        quiz_response.set_result(recommendations)
        
        db.session.add(quiz_response)
        db.session.commit()
        
        return jsonify({
            'riasec_scores': riasec_scores,
            'recommendations': recommendations,
            'quiz_id': quiz_response.id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_fallback_recommendations(riasec_scores):
    """Fallback recommendations when Gemini is unavailable"""
    # Find top 3 RIASEC categories
    sorted_scores = sorted(riasec_scores.items(), key=lambda x: x[1], reverse=True)
    top_categories = [cat for cat, score in sorted_scores[:3]]
    
    # Career mapping based on RIASEC
    career_mapping = {
        'Realistic': {
            'title': 'Mechanical Engineer',
            'description': 'Design and build mechanical systems and devices',
            'match_percentage': 85,
            'skills': ['Problem-solving', 'Technical drawing', 'Mathematics', 'Physics']
        },
        'Investigative': {
            'title': 'Data Scientist',
            'description': 'Analyze complex data to help organizations make decisions',
            'match_percentage': 90,
            'skills': ['Statistics', 'Programming', 'Machine Learning', 'Critical thinking']
        },
        'Artistic': {
            'title': 'UX/UI Designer',
            'description': 'Create user-friendly and visually appealing digital experiences',
            'match_percentage': 88,
            'skills': ['Design thinking', 'Creativity', 'User research', 'Prototyping']
        },
        'Social': {
            'title': 'Teacher/Educator',
            'description': 'Help others learn and grow through education',
            'match_percentage': 92,
            'skills': ['Communication', 'Patience', 'Subject expertise', 'Empathy']
        },
        'Enterprising': {
            'title': 'Business Analyst',
            'description': 'Analyze business processes and recommend improvements',
            'match_percentage': 87,
            'skills': ['Analytical thinking', 'Communication', 'Project management', 'Business acumen']
        },
        'Conventional': {
            'title': 'Financial Analyst',
            'description': 'Analyze financial data and help with investment decisions',
            'match_percentage': 89,
            'skills': ['Attention to detail', 'Mathematics', 'Excel', 'Financial modeling']
        }
    }
    
    recommendations = []
    for category in top_categories:
        if category in career_mapping:
            recommendations.append(career_mapping[category])
    
    return recommendations[:3]
