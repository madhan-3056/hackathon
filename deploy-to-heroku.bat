@echo off
echo ===== Deploying Virtual Lawyer to Heroku =====
echo.
echo This script will guide you through deploying your application to Heroku
echo.
echo Prerequisites:
echo 1. A Heroku account
echo 2. Heroku CLI installed on your computer
echo 3. Git installed on your computer
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Step 1: Preparing your application for deployment...
echo.

echo Checking if Heroku CLI is installed...
heroku --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Heroku CLI is not installed. Please install it and try again.
    echo You can download it from https://devcenter.heroku.com/articles/heroku-cli
    exit /b 1
)

echo Checking if Git is installed...
git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Git is not installed. Please install Git and try again.
    echo You can download Git from https://git-scm.com/downloads
    exit /b 1
)

echo.
echo Step 2: Setting up Heroku application...
echo.

set /p app_name="Enter a name for your Heroku application (e.g., virtual-lawyer): "

echo Creating Heroku application...
heroku create %app_name%

echo.
echo Step 3: Setting up Git repository...
echo.

if not exist ".git" (
    echo Initializing Git repository...
    git init
    
    echo Creating .gitignore file...
    echo node_modules > .gitignore
    echo .env >> .gitignore
    echo .DS_Store >> .gitignore
    echo npm-debug.log >> .gitignore
    echo /frontend/node_modules >> .gitignore
    
    echo Adding files to Git...
    git add .
    
    echo Creating initial commit...
    git commit -m "Initial commit for Heroku deployment"
) else (
    echo Git repository already exists.
    
    echo Adding any new files to Git...
    git add .
    
    echo Creating deployment commit...
    git commit -m "Heroku deployment update"
)

echo.
echo Step 4: Setting up environment variables...
echo.

echo Setting up environment variables on Heroku...
heroku config:set NODE_ENV=production --app %app_name%

set /p mongodb_uri="Enter your MongoDB URI (or press Enter to skip): "
if not "%mongodb_uri%"=="" (
    heroku config:set MONGODB_URI=%mongodb_uri% --app %app_name%
)

set /p jwt_secret="Enter a JWT secret key (or press Enter to generate one): "
if "%jwt_secret%"=="" (
    set "jwt_secret=%RANDOM%%RANDOM%%RANDOM%%RANDOM%"
)
heroku config:set JWT_SECRET=%jwt_secret% --app %app_name%

heroku config:set JWT_EXPIRE=30d --app %app_name%
heroku config:set JWT_COOKIE_EXPIRE=30 --app %app_name%

echo.
echo Step 5: Building the frontend...
echo.

echo Building the frontend...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo Step 6: Deploying to Heroku...
echo.

echo Adding Heroku remote...
git remote add heroku https://git.heroku.com/%app_name%.git

echo Pushing code to Heroku...
git push heroku master

echo.
echo Deployment complete!
echo.
echo Your application is now available at: https://%app_name%.herokuapp.com
echo.
echo Press any key to exit...
pause > nul