@echo off
echo ===== Deploying Virtual Lawyer Frontend to Vercel =====
echo.

echo Step 1: Checking if Vercel CLI is installed...
vercel --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI is not installed. Installing it now...
    npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install Vercel CLI. Please install it manually:
        echo npm install -g vercel
        pause
        exit /b 1
    )
)

echo.
echo Step 2: Checking if you're logged in to Vercel...
vercel whoami >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo You're not logged in to Vercel. Please log in:
    vercel login
)

echo.
echo Step 3: Building the frontend...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo Step 4: Creating a vercel.json file...
echo { > frontend/vercel.json
echo   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] >> frontend/vercel.json
echo } >> frontend/vercel.json

echo.
echo Step 5: Deploying to Vercel...
cd frontend
vercel --prod

echo.
echo ===== Deployment Complete =====
echo.
echo Your frontend is now deployed to Vercel!
echo You can access it at the URL provided above.
echo.
echo Note: Since this is only the frontend, you'll need to deploy the backend separately
echo and update the API endpoints in the frontend to point to your backend URL.
echo.
pause