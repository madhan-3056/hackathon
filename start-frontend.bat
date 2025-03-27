@echo off
echo ===== Starting Virtual Lawyer Frontend =====

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
echo Step 2: Starting the frontend...
echo.
echo The frontend will be available at:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the frontend.
echo.

start "" http://localhost:3000

echo Starting frontend...
call npm start