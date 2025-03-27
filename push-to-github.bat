@echo off
echo ===== Pushing Virtual Lawyer to GitHub =====
echo.
echo This script will guide you through pushing your code to GitHub
echo.
echo Prerequisites:
echo 1. A GitHub account
echo 2. Git installed on your computer
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Step 1: Checking if Git is installed...
echo.

git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Git is not installed. Please install Git and try again.
    echo You can download Git from https://git-scm.com/downloads
    exit /b 1
)

echo Git is installed.

echo.
echo Step 2: Setting up Git repository...
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
    
    echo Git repository initialized.
) else (
    echo Git repository already exists.
)

echo.
echo Step 3: Setting up GitHub repository...
echo.

set /p repo_name="Enter a name for your GitHub repository (e.g., virtual-lawyer): "
set /p github_username="Enter your GitHub username: "

echo.
echo Step 4: Adding files to Git...
echo.

echo Adding all files to Git...
git add .

echo.
echo Step 5: Committing changes...
echo.

set /p commit_message="Enter a commit message (e.g., Initial commit): "
git commit -m "%commit_message%"

echo.
echo Step 6: Creating GitHub repository...
echo.

echo Please create a new repository on GitHub:
echo.
echo 1. Go to https://github.com/new
echo 2. Enter "%repo_name%" as the repository name
echo 3. Choose whether to make it public or private
echo 4. Do NOT initialize with README, .gitignore, or license
echo 5. Click "Create repository"
echo.
echo Press any key when you've created the repository...
pause > nul

echo.
echo Step 7: Pushing to GitHub...
echo.

echo Adding GitHub remote...
git remote add origin https://github.com/%github_username%/%repo_name%.git

echo Pushing to GitHub...
git push -u origin master

if %errorlevel% neq 0 (
    echo.
    echo Push failed. Trying with 'main' branch instead of 'master'...
    git push -u origin main
    
    if %errorlevel% neq 0 (
        echo.
        echo Push failed. You may need to authenticate with GitHub.
        echo.
        echo Options:
        echo 1. Use GitHub CLI: https://cli.github.com/
        echo 2. Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
        echo 3. Use GitHub Desktop: https://desktop.github.com/
        echo.
        echo After authenticating, run:
        echo git push -u origin master
        echo.
        exit /b 1
    )
)

echo.
echo Success! Your code has been pushed to GitHub.
echo.
echo Your repository is available at: https://github.com/%github_username%/%repo_name%
echo.
echo Next steps:
echo 1. To deploy to Render: run deploy-to-render.bat
echo 2. To deploy to Heroku: run deploy-to-heroku.bat
echo.
echo Press any key to exit...
pause > nul