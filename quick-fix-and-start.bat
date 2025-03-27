@echo off
echo ===== Virtual Lawyer Quick Fix and Start =====
echo This script will fix the 'react-scripts' not recognized error and start the application.

echo.
echo Step 1: Installing backend dependencies...
if not exist "node_modules" (
    echo Backend dependencies not found. Installing...
    call npm install
) else (
    echo Backend dependencies found.
)

echo.
echo Step 2: Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Frontend dependencies not found. Installing...
    call npm install
) else (
    echo Frontend dependencies found.
)

echo.
echo Step 3: Installing react-scripts specifically...
call npm install react-scripts --save

echo.
echo Step 4: Verifying react-scripts installation...
call npx react-scripts --version
if %ERRORLEVEL% NEQ 0 (
    echo Error: react-scripts installation failed.
    echo Please try running the following commands manually:
    echo cd frontend
    echo npm install
    echo npm install react-scripts --save
    cd ..
    pause
    exit /b 1
) else (
    echo react-scripts installed successfully!
)
cd ..

echo.
echo Step 5: Starting the application...
echo.
echo The application will be available at:
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5001
echo API Documentation: http://localhost:5001/api-docs
echo.
echo Press Ctrl+C to stop the application.
echo.

start "" http://localhost:3000

echo Starting both frontend and backend...
call npm run dev:both