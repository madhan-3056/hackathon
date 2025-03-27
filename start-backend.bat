@echo off
echo ===== Starting Virtual Lawyer Backend =====

echo.
echo Step 1: Checking if backend dependencies are installed...
if not exist "node_modules" (
    echo Backend dependencies not found. Installing...
    call npm install
) else (
    echo Backend dependencies found.
)

echo.
echo Step 2: Starting the backend...
echo.
echo The backend will be available at:
echo http://localhost:5001
echo API Documentation: http://localhost:5001/api-docs
echo.
echo Press Ctrl+C to stop the backend.
echo.

start "" http://localhost:5001

echo Starting backend...
call npm run backend