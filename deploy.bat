@echo off
echo ===== Virtual Lawyer Deployment Menu =====
echo.
echo Choose a deployment option:
echo 1. Deploy to a live server (SSH)
echo 2. Deploy to Heroku
echo 3. Deploy to Netlify (frontend only)
echo 4. Deploy to Vercel (frontend only)
echo 5. Deploy to Render
echo 6. Deploy via FTP
echo 7. View deployment guide
echo 8. Exit
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" (
    call deploy-live.bat
) else if "%choice%"=="2" (
    call deploy-heroku.bat
) else if "%choice%"=="3" (
    call deploy-netlify.bat
) else if "%choice%"=="4" (
    call deploy-vercel.bat
) else if "%choice%"=="5" (
    call deploy-render.bat
) else if "%choice%"=="6" (
    call deploy-ftp.bat
) else if "%choice%"=="7" (
    echo.
    echo Opening deployment guide...
    start "" CONNECT-AND-DEPLOY.md
    echo.
    pause
    call deploy.bat
) else if "%choice%"=="8" (
    echo.
    echo Exiting...
    exit /b 0
) else (
    echo.
    echo Invalid choice. Please try again.
    echo.
    pause
    call deploy.bat
)