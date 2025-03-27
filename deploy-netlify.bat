@echo off
echo ===== Deploying Virtual Lawyer Frontend to Netlify =====
echo.

echo Step 1: Checking if Netlify CLI is installed...
netlify --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Netlify CLI is not installed. Installing it now...
    npm install -g netlify-cli
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install Netlify CLI. Please install it manually:
        echo npm install -g netlify-cli
        pause
        exit /b 1
    )
)

echo.
echo Step 2: Checking if you're logged in to Netlify...
netlify status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo You're not logged in to Netlify. Please log in:
    netlify login
)

echo.
echo Step 3: Building the frontend...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo Step 4: Creating a _redirects file for Netlify...
echo /* /index.html 200 > frontend/build/_redirects

echo.
echo Step 5: Deploying to Netlify...
cd frontend
netlify deploy --prod --dir=build

echo.
echo ===== Deployment Complete =====
echo.
echo Your frontend is now deployed to Netlify!
echo You can access it at the URL provided above.
echo.
echo Note: Since this is only the frontend, you'll need to deploy the backend separately
echo and update the API endpoints in the frontend to point to your backend URL.
echo.
pause