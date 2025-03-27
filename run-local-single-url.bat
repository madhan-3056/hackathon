@echo off
echo ===== Running Virtual Lawyer with Single URL =====
echo.
echo This script will:
echo 1. Install dependencies
echo 2. Build the frontend
echo 3. Start the enhanced server
echo.
echo Your application will be available at: http://localhost:5001
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Step 1: Installing dependencies...
echo.

echo Installing backend dependencies...
call npm install

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Step 2: Building frontend...
echo.
cd frontend
call npm run build
cd ..

echo.
echo Step 3: Creating necessary directories...
echo.
if not exist "frontend\build" (
    echo Frontend build directory not found. Build failed.
    exit /b 1
)

echo.
echo Step 4: Starting the enhanced server...
echo.
echo Your application will be available at: http://localhost:5001
echo Press Ctrl+C to stop the server
echo.

echo Opening browser in 5 seconds...
start /b cmd /c "timeout /t 5 > nul && start http://localhost:5001"

node server-enhanced.js