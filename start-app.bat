@echo off
echo ===== Starting Virtual Lawyer Application =====

echo.
echo Step 1: Checking if frontend dependencies are installed...
cd frontend
if not exist "node_modules" (
    echo Frontend dependencies not found. Installing...
    call npm install
    call npm install react-scripts --save
) else (
    echo Frontend dependencies found.
)

echo.
echo Step 2: Checking if backend dependencies are installed...
cd ..
if not exist "node_modules" (
    echo Backend dependencies not found. Installing...
    call npm install
) else (
    echo Backend dependencies found.
)

echo.
echo Step 3: Starting the application...
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