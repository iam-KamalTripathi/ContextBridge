import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv('./config.env')

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_career_recommendations(riasec_scores, user_description=""):
    """Get career recommendations based on RIASEC scores and user description"""
    try:
        prompt = f"""
        Based on the following RIASEC (Holland Code) assessment scores and user description, provide 3 specific career recommendations.
        
        RIASEC Scores:
        - Realistic: {riasec_scores.get('Realistic', 0)}
        - Investigative: {riasec_scores.get('Investigative', 0)}
        - Artistic: {riasec_scores.get('Artistic', 0)}
        - Social: {riasec_scores.get('Social', 0)}
        - Enterprising: {riasec_scores.get('Enterprising', 0)}
        - Conventional: {riasec_scores.get('Conventional', 0)}
        
        User Description: "{user_description}"
        
        Please provide 3 career recommendations in the following JSON format:
        {{
            "recommendations": [
                {{
                    "title": "Career Title",
                    "description": "Brief description of the career",
                    "match_percentage": 85,
                    "skills": ["skill1", "skill2", "skill3", "skill4"],
                    "why_fits": "Explanation of why this career fits the user",
                    "growth_outlook": "Career growth prospects and market demand"
                }}
            ]
        }}
        
        Make sure the recommendations are:
        1. Specific and realistic career paths
        2. Based on the RIASEC scores (prioritize higher scoring categories)
        3. Include modern, relevant careers
        4. Provide practical skills and growth information
        """
        
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        
        # Try to parse JSON response
        try:
            result = json.loads(response.text)
            return result.get('recommendations', [])
        except json.JSONDecodeError:
            # If JSON parsing fails, return structured fallback
            return get_fallback_recommendations(riasec_scores)
            
    except Exception as e:
        print(f"Gemini API error: {e}")
        return get_fallback_recommendations(riasec_scores)

def get_chat_response(user_message, context=""):
    """Get AI response for chat conversation"""
    try:
        prompt = f"""
        You are a professional career counselor and AI assistant. Help the user with career-related questions and guidance.
        
        Context about the user: {context}
        
        User's message: {user_message}
        
        Please provide a helpful, encouraging, and professional response. Focus on:
        1. Career guidance and advice
        2. Educational pathways
        3. Skill development
        4. Job market insights
        5. Motivation and encouragement
        
        Keep responses conversational but informative. If the user asks about specific careers, provide detailed information about requirements, skills needed, and growth prospects.
        """
        
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        
        return response.text
        
    except Exception as e:
        print(f"Gemini API error: {e}")
        return "I apologize, but I'm having trouble processing your request right now. Please try again later."

def get_fallback_recommendations(riasec_scores):
    """Fallback recommendations when Gemini API is unavailable"""
    # Find top 3 RIASEC categories
    sorted_scores = sorted(riasec_scores.items(), key=lambda x: x[1], reverse=True)
    top_categories = [cat for cat, score in sorted_scores[:3]]
    
    # Career mapping based on RIASEC
    career_mapping = {
        'Realistic': {
            'title': 'Mechanical Engineer',
            'description': 'Design and build mechanical systems and devices',
            'match_percentage': 85,
            'skills': ['Problem-solving', 'Technical drawing', 'Mathematics', 'Physics'],
            'why_fits': 'Your high Realistic score indicates you enjoy working with tools and building things.',
            'growth_outlook': 'Strong demand in manufacturing, automotive, and aerospace industries.'
        },
        'Investigative': {
            'title': 'Data Scientist',
            'description': 'Analyze complex data to help organizations make decisions',
            'match_percentage': 90,
            'skills': ['Statistics', 'Programming', 'Machine Learning', 'Critical thinking'],
            'why_fits': 'Your Investigative nature aligns with data analysis and research.',
            'growth_outlook': 'One of the fastest-growing fields with high demand across industries.'
        },
        'Artistic': {
            'title': 'UX/UI Designer',
            'description': 'Create user-friendly and visually appealing digital experiences',
            'match_percentage': 88,
            'skills': ['Design thinking', 'Creativity', 'User research', 'Prototyping'],
            'why_fits': 'Your Artistic score suggests you enjoy creative expression and design.',
            'growth_outlook': 'High demand in tech companies and digital agencies.'
        },
        'Social': {
            'title': 'Teacher/Educator',
            'description': 'Help others learn and grow through education',
            'match_percentage': 92,
            'skills': ['Communication', 'Patience', 'Subject expertise', 'Empathy'],
            'why_fits': 'Your Social score indicates you enjoy helping and teaching others.',
            'growth_outlook': 'Consistent demand with opportunities in various educational settings.'
        },
        'Enterprising': {
            'title': 'Business Analyst',
            'description': 'Analyze business processes and recommend improvements',
            'match_percentage': 87,
            'skills': ['Analytical thinking', 'Communication', 'Project management', 'Business acumen'],
            'why_fits': 'Your Enterprising nature aligns with leadership and business strategy.',
            'growth_outlook': 'Strong demand across all industries for business optimization.'
        },
        'Conventional': {
            'title': 'Financial Analyst',
            'description': 'Analyze financial data and help with investment decisions',
            'match_percentage': 89,
            'skills': ['Attention to detail', 'Mathematics', 'Excel', 'Financial modeling'],
            'why_fits': 'Your Conventional score suggests you prefer organized, structured work.',
            'growth_outlook': 'Stable demand in finance, banking, and corporate sectors.'
        }
    }
    
    recommendations = []
    for category in top_categories:
        if category in career_mapping:
            recommendations.append(career_mapping[category])
    
    return recommendations[:3]
