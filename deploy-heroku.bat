@echo off
echo ===== Deploying Virtual Lawyer to Heroku =====
echo.

set /p APP_NAME="Enter your Heroku app name (or press Enter to use the provided name): "
if "%APP_NAME%"=="" set APP_NAME=%1
if "%APP_NAME%"=="" set APP_NAME=virtual-lawyer

echo.
echo Deploying to Heroku app: %APP_NAME%
echo.

echo Step 1: Checking if Heroku CLI is installed...
heroku --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Heroku CLI is not installed. Please install it from https://devcenter.heroku.com/articles/heroku-cli
    echo After installing, run this script again.
    pause
    exit /b 1
)

echo.
echo Step 2: Checking if you're logged in to Heroku...
heroku auth:whoami >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo You're not logged in to Heroku. Please log in:
    heroku login
)

echo.
echo Step 3: Checking if the app exists...
heroku apps:info --app %APP_NAME% >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo App does not exist. Creating app %APP_NAME%...
    heroku create %APP_NAME%
) else (
    echo App %APP_NAME% already exists.
)

echo.
echo Step 4: Building the application for deployment...
call build-for-deployment.bat

echo.
echo Step 5: Setting up Heroku Git remote...
heroku git:remote --app %APP_NAME%

echo.
echo Step 6: Setting up environment variables...
heroku config:set NODE_ENV=production --app %APP_NAME%
heroku config:set JWT_SECRET=your_jwt_secret --app %APP_NAME%
heroku config:set JWT_EXPIRE=30d --app %APP_NAME%
heroku config:set JWT_COOKIE_EXPIRE=30 --app %APP_NAME%

echo.
echo Step 7: Setting up MongoDB...
echo Do you want to set up MongoDB Atlas (y/n)?
set /p SETUP_MONGO=
if /i "%SETUP_MONGO%"=="y" (
    set /p MONGODB_URI="Enter your MongoDB Atlas URI: "
    heroku config:set MONGODB_URI=%MONGODB_URI% --app %APP_NAME%
) else (
    echo Setting up Heroku MongoDB addon...
    heroku addons:create mongolab:sandbox --app %APP_NAME%
)

echo.
echo Step 8: Deploying to Heroku...
git add .
git commit -m "Deploy to Heroku"
git push heroku master

echo.
echo Step 9: Ensuring at least one instance is running...
heroku ps:scale web=1 --app %APP_NAME%

echo.
echo ===== Deployment Complete =====
echo.
echo Your application is now deployed to Heroku!
echo You can access it at: https://%APP_NAME%.herokuapp.com
echo.
echo To view the logs, run:
echo heroku logs --tail --app %APP_NAME%
echo.
pause