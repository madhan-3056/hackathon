@echo off
echo ===== Deploying Virtual Lawyer to Render =====
echo.

echo This script will guide you through deploying your application to Render.com
echo.
echo Render does not have a CLI tool for deployment, so you'll need to use the Render Dashboard.
echo.
echo Step 1: Building the application for deployment...
call build-for-deployment.bat

echo.
echo Step 2: Preparing for Render deployment...
echo Creating render.yaml file...

echo services: > render.yaml
echo   - type: web >> render.yaml
echo     name: virtual-lawyer >> render.yaml
echo     env: node >> render.yaml
echo     buildCommand: npm install >> render.yaml
echo     startCommand: node server-combined.js >> render.yaml
echo     envVars: >> render.yaml
echo       - key: NODE_ENV >> render.yaml
echo         value: production >> render.yaml
echo       - key: JWT_SECRET >> render.yaml
echo         generateValue: true >> render.yaml
echo       - key: JWT_EXPIRE >> render.yaml
echo         value: 30d >> render.yaml
echo       - key: JWT_COOKIE_EXPIRE >> render.yaml
echo         value: 30 >> render.yaml
echo       - key: MONGODB_URI >> render.yaml
echo         sync: false >> render.yaml

echo.
echo Step 3: Instructions for deploying to Render:
echo.
echo 1. Create a GitHub repository for your project and push your code to it.
echo.
echo 2. Go to https://dashboard.render.com/
echo.
echo 3. Click on "New" and select "Blueprint" to deploy using the render.yaml file.
echo.
echo 4. Connect your GitHub repository.
echo.
echo 5. Configure your environment variables, especially MONGODB_URI.
echo.
echo 6. Click "Apply" to deploy your application.
echo.
echo Your application will be deployed to a URL like: https://virtual-lawyer.onrender.com
echo.
echo Would you like to open the Render dashboard now? (y/n)
set /p OPEN_RENDER=
if /i "%OPEN_RENDER%"=="y" (
    start https://dashboard.render.com/
)

echo.
echo ===== Deployment Instructions Complete =====
echo.
pause