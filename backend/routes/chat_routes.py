from flask import Blueprint, request, jsonify
import jwt
import os
from models import User, ChatHistory, QuizResponse
from database import db
from utils.gemini_client import get_chat_response

chat_bp = Blueprint('chat', __name__)

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

@chat_bp.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages with Gemini AI"""
    try:
        user = verify_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get user's quiz history for context
        latest_quiz = QuizResponse.query.filter_by(user_id=user.id).order_by(QuizResponse.created_at.desc()).first()
        user_context = ""
        
        if latest_quiz:
            quiz_result = latest_quiz.get_result()
            if quiz_result:
                user_context = f"User's career assessment results: {quiz_result}. "
        
        # Get recent chat history for context
        recent_chats = ChatHistory.query.filter_by(user_id=user.id).order_by(ChatHistory.created_at.desc()).limit(5).all()
        chat_context = ""
        if recent_chats:
            chat_context = "Recent conversation: "
            for chat in reversed(recent_chats):
                chat_context += f"User: {chat.message} Bot: {chat.response} "
        
        # Generate response using Gemini
        try:
            response = get_chat_response(message, user_context + chat_context)
        except Exception as e:
            response = "I apologize, but I'm having trouble processing your request right now. Please try again later."
        
        # Save chat to database
        chat_entry = ChatHistory(
            user_id=user.id,
            message=message,
            response=response
        )
        db.session.add(chat_entry)
        db.session.commit()
        
        return jsonify({
            'response': response,
            'timestamp': chat_entry.created_at.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/chat-history', methods=['GET'])
def get_chat_history():
    """Get user's chat history"""
    try:
        user = verify_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        chats = ChatHistory.query.filter_by(user_id=user.id)\
            .order_by(ChatHistory.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        chat_list = []
        for chat in chats.items:
            chat_list.append({
                'id': chat.id,
                'message': chat.message,
                'response': chat.response,
                'created_at': chat.created_at.isoformat()
            })
        
        return jsonify({
            'chats': chat_list,
            'total': chats.total,
            'page': page,
            'per_page': per_page,
            'pages': chats.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
