"""
Simple test script to verify the NextStep setup
"""

import sys
import os

def test_imports():
    """Test if all required modules can be imported"""
    try:
        # Test backend imports
        sys.path.append('backend')
        from backend.app import app
        from backend.models import User, QuizResponse, ChatHistory, ContactMessage
        from backend.database import db
        print("Backend imports successful")
        return True
    except ImportError as e:
        print(f"Backend import error: {e}")
        return False

def test_file_structure():
    """Test if all required files exist"""
    required_files = [
        'backend/app.py',
        'backend/models.py',
        'backend/database.py',
        'backend/requirements.txt',
        'frontend/package.json',
        'frontend/src/App.jsx',
        'frontend/src/index.js',
        'README.md'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"Missing files: {missing_files}")
        return False
    else:
        print("All required files present")
        return True

def main():
    print("Testing NextStep Setup...")
    print("=" * 50)
    
    # Test file structure
    files_ok = test_file_structure()
    
    # Test imports (only if files are ok)
    imports_ok = False
    if files_ok:
        imports_ok = test_imports()
    
    print("=" * 50)
    if files_ok and imports_ok:
        print("[OK] Setup test passed! You can now run the application.")
        print("\nNext steps:")
        print("1. cd backend && pip install -r requirements.txt")
        print("2. Add your GEMINI_API_KEY to backend/config.env")
        print("3. python backend/app.py")
        print("4. cd frontend && npm install && npm start")
    else:
        print("[ERROR] Setup test failed. Please check the errors above.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
