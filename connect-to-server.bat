@echo off
echo ===== Virtual Lawyer Server Connection Tool =====

set /p SERVER_IP="Enter your server IP address: "
set /p SERVER_USER="Enter your server username: "
set /p SERVER_PORT="Enter your server SSH port (default: 22): "
if "%SERVER_PORT%"=="" set SERVER_PORT=22

echo.
echo Connected to %SERVER_IP% as %SERVER_USER%
echo.
echo Choose an action:
echo 1. SSH into server
echo 2. View application logs
echo 3. Restart application
echo 4. Check application status
echo 5. Update application
echo 6. Backup database
echo 7. View server resources
echo 8. Check SSL certificate
echo 9. Exit
echo.

set /p CHOICE="Enter your choice (1-9): "

echo.
echo Checking if WSL (Windows Subsystem for Linux) is available...
wsl echo "WSL is available" > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo WSL is available, using it for server operations...
    echo.
    
    if "%CHOICE%"=="1" (
        echo Connecting to server via SSH...
        wsl ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP%
    ) else if "%CHOICE%"=="2" (
        echo Viewing application logs...
        wsl ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "cd ~/virtual-lawyer && pm2 logs --lines 100"
    ) else if "%CHOICE%"=="3" (
        echo Restarting application...
        wsl ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "cd ~/virtual-lawyer && pm2 restart all"
        echo Application restarted successfully!
    ) else if "%CHOICE%"=="4" (
        echo Checking application status...
        wsl ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "cd ~/virtual-lawyer && pm2 status"
    ) else if "%CHOICE%"=="5" (
        echo Updating application...
        echo This will copy your local files to the server and restart the application.
        set /p CONFIRM="Are you sure you want to continue? (y/n): "
        if "%CONFIRM%"=="y" (
            wsl rsync -avz -e "ssh -p %SERVER_PORT%" --exclude 'node_modules' --exclude '.git' --exclude '.env' ./ %SERVER_USER%@%SERVER_IP%:~/virtual-lawyer/
            wsl ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "cd ~/virtual-lawyer && npm install && pm2 restart all"
            echo Application updated successfully!
        ) else (
            echo Update cancelled.
        )
    ) else if "%CHOICE%"=="6" (
        echo Backing up database...
        wsl ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "mkdir -p ~/mongodb-backups && mongodump --out ~/mongodb-backups/$(date +%%Y%%m%%d_%%H%%M%%S)"
        echo Database backed up successfully!
    ) else if "%CHOICE%"=="7" (
        echo Viewing server resources...
        wsl ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "echo 'CPU and Memory Usage:' && top -bn1 | head -15 && echo '' && echo 'Disk Usage:' && df -h && echo '' && echo 'Memory Info:' && free -h"
    ) else if "%CHOICE%"=="8" (
        echo Checking SSL certificate...
        wsl ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "sudo certbot certificates"
    ) else if "%CHOICE%"=="9" (
        echo Exiting...
        exit /b 0
    ) else (
        echo Invalid choice. Exiting...
        exit /b 1
    )
) else (
    echo WSL is not available. Please install WSL or use a Linux/Mac system for server operations.
    echo Alternatively, you can use PuTTY or another SSH client to connect to your server.
    echo.
    echo For detailed instructions, see LIVE-SERVER-GUIDE.md
)

echo.
echo ===== Operation Complete =====
pause