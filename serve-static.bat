@echo off
echo ===== Serving Static Frontend =====
echo.
echo This script will:
echo 1. Build the frontend (if needed)
echo 2. Start a simple static server
echo.
echo Note: This will only serve the frontend. API calls will not work.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Step 1: Checking frontend build...
echo.

if not exist "frontend\build" (
    echo Frontend build not found. Building now...
    cd frontend
    call npm install
    call npm run build
    cd ..
) else (
    echo Frontend build found.
)

echo.
echo Step 2: Starting static server...
echo.
echo Your static frontend will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

echo Opening browser in 3 seconds...
start /b cmd /c "timeout /t 3 > nul && start http://localhost:8080"

node serve-static.js