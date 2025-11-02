"""
NextStep - Full Stack Startup Script
Runs both backend and frontend servers simultaneously
"""

import os
import sys
import subprocess
import time
import threading
import signal

def run_backend():
    """Run the backend server"""
    print("[BACKEND] Starting NextStep backend server...")
    try:
        subprocess.run([sys.executable, 'start_backend.py'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"[BACKEND ERROR] Failed to start backend: {e}")
    except KeyboardInterrupt:
        print("[BACKEND] Backend server stopped")

def run_frontend():
    """Run the frontend server"""
    print("[FRONTEND] Starting NextStep frontend server...")
    try:
        subprocess.run([sys.executable, 'start_frontend.py'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"[FRONTEND ERROR] Failed to start frontend: {e}")
    except KeyboardInterrupt:
        print("[FRONTEND] Frontend server stopped")

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n[SHUTDOWN] Stopping all servers...")
    sys.exit(0)

def main():
    print("NextStep - Full Stack Application")
    print("=" * 50)
    print("[INFO] Starting both backend and frontend servers...")
    print("[INFO] Backend will be available at: http://localhost:5000")
    print("[INFO] Frontend will be available at: http://localhost:3000")
    print("[INFO] Press Ctrl+C to stop all servers")
    print("=" * 50)
    
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    time.sleep(2)
    
    # Start frontend in a separate thread
    frontend_thread = threading.Thread(target=run_frontend, daemon=True)
    frontend_thread.start()
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Stopping all servers...")
        sys.exit(0)

if __name__ == "__main__":
    main()
