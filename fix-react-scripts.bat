@echo off
echo ===== Fix React Scripts =====
echo This script will fix the 'react-scripts' not recognized error.

echo.
echo Installing react-scripts in the frontend directory...
cd frontend
call npm install react-scripts --save

echo.
echo Verifying installation...
call npx react-scripts --version
if %ERRORLEVEL% NEQ 0 (
    echo Error: react-scripts installation failed.
    echo Please try running the following commands manually:
    echo cd frontend
    echo npm install react-scripts --save
) else (
    echo react-scripts installed successfully!
)
cd ..

echo.
echo ===== Fix Complete =====
echo.
echo You can now start the application using:
echo start.bat
echo.
echo Or run the frontend directly:
echo cd frontend
echo npm start
echo.
pause