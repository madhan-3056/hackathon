@echo off
echo ===== Virtual Lawyer Windows Deployment Helper =====
echo This script will help you deploy your application from Windows.

echo.
echo Choose a deployment method:
echo 1. Deploy to a VPS (requires SSH client)
echo 2. Deploy with Docker (requires Docker Desktop)
echo 3. Deploy to Heroku (requires Heroku CLI)
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo To deploy to a VPS, you need an SSH client like PuTTY or OpenSSH.
    echo If you have OpenSSH installed, you can use the deploy.sh script.
    echo.
    echo Manual steps:
    echo 1. Copy your files to the server using SCP or SFTP
    echo 2. SSH into your server
    echo 3. Install Node.js, MongoDB, and PM2
    echo 4. Set up your environment variables
    echo 5. Start your application with PM2
    echo.
    echo For detailed instructions, see DEPLOYMENT.md
) else if "%choice%"=="2" (
    echo.
    echo To deploy with Docker, you need Docker Desktop installed.
    echo.
    echo Steps:
    echo 1. Make sure Docker Desktop is running
    echo 2. Open a command prompt in this directory
    echo 3. Run: docker-compose up -d
    echo.
    echo Your application will be available at http://localhost:5001
    echo.
    echo For detailed instructions, see DEPLOYMENT.md
) else if "%choice%"=="3" (
    echo.
    echo To deploy to Heroku, you need the Heroku CLI installed.
    echo.
    echo Steps:
    echo 1. Open a command prompt in this directory
    echo 2. Run: heroku login
    echo 3. Run: heroku create your-app-name
    echo 4. Run: heroku config:set NODE_ENV=production
    echo 5. Run: heroku config:set CLAUDE_API_KEY=your-claude-api-key
    echo 6. Run: heroku config:set JWT_SECRET=your-jwt-secret
    echo 7. Run: heroku config:set JWT_EXPIRE=30d
    echo 8. Run: heroku config:set JWT_COOKIE_EXPIRE=30
    echo 9. Run: git push heroku main
    echo.
    echo For detailed instructions, see DEPLOYMENT.md
) else (
    echo Invalid choice. Please run the script again and choose a valid option.
)

echo.
echo ===== End of Deployment Helper =====
pause