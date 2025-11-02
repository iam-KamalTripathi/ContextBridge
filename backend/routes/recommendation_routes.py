from flask import Blueprint, request, jsonify
import jwt
import os
from models import User, QuizResponse, ContactMessage
from database import db

recommendation_bp = Blueprint('recommendation', __name__)

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

@recommendation_bp.route('/user/history', methods=['GET'])
def get_user_history():
    """Get user's quiz and recommendation history"""
    try:
        user = verify_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        # Get quiz responses with results
        quiz_responses = QuizResponse.query.filter_by(user_id=user.id)\
            .order_by(QuizResponse.created_at.desc()).all()
        
        history = []
        for quiz in quiz_responses:
            history.append({
                'id': quiz.id,
                'answers': quiz.get_answers(),
                'text_response': quiz.text_response,
                'result': quiz.get_result(),
                'created_at': quiz.created_at.isoformat()
            })
        
        return jsonify({
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            },
            'history': history
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendation_bp.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({'error': 'Name, email, and message are required'}), 400
        
        # Save contact message
        contact_msg = ContactMessage(
            name=data['name'],
            email=data['email'],
            message=data['message']
        )
        
        db.session.add(contact_msg)
        db.session.commit()
        
        return jsonify({
            'message': 'Thank you for your message! We will get back to you soon.',
            'id': contact_msg.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendation_bp.route('/recommend', methods=['POST'])
def generate_recommendation():
    """Generate new career recommendations"""
    try:
        user = verify_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.get_json()
        description = data.get('description', '')
        
        if not description:
            return jsonify({'error': 'Description is required'}), 400
        
        # This would typically use Gemini API for new recommendations
        # For now, return a simple response
        recommendations = [
            {
                'title': 'Career Counselor',
                'description': 'Help others discover their career paths',
                'match_percentage': 85,
                'skills': ['Communication', 'Psychology', 'Career development', 'Empathy']
            },
            {
                'title': 'Human Resources Specialist',
                'description': 'Manage employee relations and recruitment',
                'match_percentage': 80,
                'skills': ['Communication', 'Organization', 'Problem-solving', 'Interpersonal skills']
            },
            {
                'title': 'Life Coach',
                'description': 'Help people achieve their personal and professional goals',
                'match_percentage': 88,
                'skills': ['Active listening', 'Motivation', 'Goal setting', 'Communication']
            }
        ]
        
        return jsonify({
            'recommendations': recommendations,
            'description': description
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
