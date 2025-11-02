@echo off
echo Starting NextStep - Full Stack Application
echo ================================================

echo.
echo [INFO] Starting Backend Server...
start "NextStep Backend" cmd /k "python start_backend.py"

echo.
echo [INFO] Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak > nul

echo.
echo [INFO] Starting Frontend Server...
start "NextStep Frontend" cmd /k "python start_frontend.py"

echo.
echo [SUCCESS] Both servers are starting up!
echo.
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
