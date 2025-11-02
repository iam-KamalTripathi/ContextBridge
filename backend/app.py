from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv('config.env')

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///career_compass.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
from database import db
db.init_app(app)
CORS(app)

# Import models after db is initialized
from models import User, QuizResponse, ChatHistory, ContactMessage

# Import routes
from routes.auth_routes import auth_bp
from routes.quiz_routes import quiz_bp
from routes.chat_routes import chat_bp
from routes.recommendation_routes import recommendation_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(quiz_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(recommendation_bp, url_prefix='/api')

# Create tables
with app.app_context():
    db.create_all()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'NextStep API is running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
