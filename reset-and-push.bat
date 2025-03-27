@echo off
echo ===== Reset Git Remote and Push to New Repository =====
echo.
echo This script will:
echo 1. Remove any existing Git remote connections
echo 2. Set up a new GitHub repository
echo 3. Push your code to the new repository
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Step 1: Checking current Git remotes...
echo.

git remote -v

echo.
echo Step 2: Removing existing Git remotes...
echo.

git remote remove origin 2>nul
echo All remotes removed.

echo.
echo Step 3: Setting up new GitHub repository...
echo.

set /p github_username="Enter your GitHub username: "
set /p repo_name="Enter a name for your GitHub repository (e.g., virtual-lawyer): "

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
echo Step 4: Adding new GitHub remote...
echo.

git remote add origin https://github.com/%github_username%/%repo_name%.git
echo New remote added: https://github.com/%github_username%/%repo_name%.git

echo.
echo Step 5: Verifying new remote...
echo.

git remote -v

echo.
echo Step 6: Ensuring all files are added to Git...
echo.

git add .

echo.
echo Step 7: Committing changes...
echo.

set /p commit_message="Enter a commit message (e.g., Initial commit): "
git commit -m "%commit_message%"

echo.
echo Step 8: Pushing to GitHub...
echo.

echo Trying to push to master branch...
git push -u origin master

if %errorlevel% neq 0 (
    echo.
    echo Push to master failed. Trying main branch...
    git push -u origin main
    
    if %errorlevel% neq 0 (
        echo.
        echo Push failed. You may need to authenticate with GitHub.
        echo.
        echo Options:
        echo 1. Use GitHub CLI: https://cli.github.com/
        echo 2. Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
        echo 3. Use GitHub Desktop: https://desktop.github.com/
        echo 4. Use a personal access token:
        echo    - Go to https://github.com/settings/tokens
        echo    - Generate a new token with 'repo' scope
        echo    - Use the token as your password when prompted
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