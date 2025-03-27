@echo off
echo ===== Virtual Lawyer Frontend Fix =====
echo This script will fix the 'react-scripts' not recognized error.

echo.
echo Step 1: Navigating to the frontend directory...
cd frontend

echo.
echo Step 2: Installing frontend dependencies...
call npm install

echo.
echo Step 3: Installing react-scripts specifically...
call npm install react-scripts --save

echo.
echo Step 4: Verifying installation...
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
echo ===== Frontend Fix Complete =====
echo.
echo To start the frontend, run:
echo cd frontend
echo npm start
echo.
echo To start the entire application, run:
echo npm run dev:both
echo.
echo Your application will be available at:
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5001
echo.
pause