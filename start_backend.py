"""
Startup script for NextStep backend
"""

import os
import sys
import subprocess

def check_requirements():
    """Check if requirements are installed"""
    try:
        import flask
        import flask_cors
        import flask_sqlalchemy
        import jwt
        import google.generativeai
        print("[OK] All required packages are installed")
        return True
    except ImportError as e:
        print(f"[ERROR] Missing package: {e}")
        print("Please run: pip install -r backend/requirements.txt")
        return False

def check_env_file():
    """Check if config.env file exists and has required variables"""
    env_path = "./backend/config.env"
    if not os.path.exists(env_path):
        print("[ERROR] config.env file not found")
        print("Please create backend/config.env with your GEMINI_API_KEY")
        return False
    
    with open(env_path, 'r') as f:
        content = f.read()
        if 'GEMINI_API_KEY' not in content or 'your-gemini-api-key-here' in content:
            print("[ERROR] Please set your GEMINI_API_KEY in backend/config.env")
            return False
    
    print("[OK] Environment file configured")
    return True

def start_server():
    """Start the Flask server"""
    print("[STARTING] NextStep backend server...")
    os.chdir('backend')
    try:
        subprocess.run([sys.executable, 'app.py'], shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Failed to start backend server: {e}")
        return False
    except FileNotFoundError:
        print("[ERROR] Python command not found. Please ensure Python is installed and in your PATH.")
        return False

def main():
    print("[SETUP] NextStep Backend Startup")
    print("=" * 40)
    
    if not check_requirements():
        return 1
    
    if not check_env_file():
        return 1
    
    print("[OK] All checks passed!")
    start_server()

if __name__ == "__main__":
    main()
