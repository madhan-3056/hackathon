@echo off
echo ===== Resetting Git Remote =====
echo.
echo This script will remove any existing Git remote connections
echo and help you set up a new one.
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

git remote remove origin
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
echo Remote reset complete!
echo.
echo To push your code to the new repository, run:
echo git push -u origin master
echo.
echo If that fails, try:
echo git push -u origin main
echo.
echo Press any key to exit...
pause > nul