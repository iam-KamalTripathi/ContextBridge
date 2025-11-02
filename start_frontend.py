"""
Startup script for NextStep frontend
"""

import os
import sys
import subprocess
import json

def check_node_modules():
    """Check if node_modules exists"""
    if os.path.exists('frontend/node_modules'):
        print("[OK] Node modules installed")
        return True
    else:
        print("[ERROR] Node modules not found")
        print("Please run: cd frontend && npm install")
        return False

def check_package_json():
    """Check if package.json exists and has required dependencies"""
    package_path = 'frontend/package.json'
    if not os.path.exists(package_path):
        print("[ERROR] package.json not found")
        return False
    
    with open(package_path, 'r') as f:
        package_data = json.load(f)
        required_deps = ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'axios']
        
        missing_deps = []
        for dep in required_deps:
            if dep not in package_data.get('dependencies', {}):
                missing_deps.append(dep)
        
        if missing_deps:
            print(f"[ERROR] Missing dependencies: {missing_deps}")
            return False
    
    print("[OK] Package.json configured correctly")
    return True

def start_frontend():
    """Start the React development server"""
    print("[STARTING] NextStep frontend server...")
    os.chdir('frontend')
    try:
        subprocess.run(['npm', 'start'], shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Failed to start frontend server: {e}")
        return False
    except FileNotFoundError:
        print("[ERROR] npm command not found. Please ensure Node.js and npm are installed and in your PATH.")
        return False

def main():
    print("[SETUP] NextStep Frontend Startup")
    print("=" * 40)
    
    if not check_package_json():
        return 1
    
    if not check_node_modules():
        return 1
    
    print("[OK] All checks passed!")
    if not start_frontend():
        return 1

if __name__ == "__main__":
    main()
