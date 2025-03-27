@echo off
echo ===== Building Virtual Lawyer for Deployment =====
echo.
echo This script will build the frontend and prepare the application for deployment.

echo.
echo Step 1: Installing backend dependencies...
call npm install

echo.
echo Step 2: Installing frontend dependencies...
cd frontend
call npm install
call npm install react-scripts --save

echo.
echo Step 3: Building frontend...
call npm run build
cd ..

echo.
echo Step 4: Copying frontend build to backend...
if not exist "frontend\build" (
    echo Error: Frontend build directory not found.
    echo Please make sure the frontend build was successful.
    pause
    exit /b 1
)

if not exist "frontend\build" mkdir frontend\build

echo Copying files...
xcopy "frontend\build" "frontend\build" /E /I /Y

echo.
echo ===== Build Complete =====
echo.
echo The application is now ready for deployment.
echo To deploy to a live server, run:
echo deploy-live.bat
echo.
pause