@echo off
echo ===== Deploying Virtual Lawyer to Live Server (SSH Method) =====
echo.

set /p SERVER_IP="Enter your server IP address: "
set /p SERVER_USER="Enter your server username: "
set /p SERVER_PORT="Enter your server SSH port (default: 22): "
if "%SERVER_PORT%"=="" set SERVER_PORT=22
set /p SERVER_PASS="Enter your server password: "

echo.
echo Server IP: %SERVER_IP%
echo Username: %SERVER_USER%
echo SSH Port: %SERVER_PORT%
echo.
echo Is this information correct? (y/n)
set /p CONFIRM=
if /i not "%CONFIRM%"=="y" (
    echo Deployment cancelled.
    exit /b 1
)

echo.
echo Step 1: Building the application for deployment...
echo.
echo Building frontend...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo Step 2: Creating deployment package...
echo.
echo Creating deployment directory...
if exist deploy rmdir /s /q deploy
mkdir deploy
mkdir deploy\frontend
mkdir deploy\backend

echo Copying frontend files...
xcopy /E /I frontend\build deploy\frontend\build

echo Copying backend files...
xcopy /E /I backend deploy\backend

echo Copying package.json and server.js...
copy package.json deploy\
copy server.js deploy\

echo Creating deployment script...
echo #!/bin/bash > deploy\setup.sh
echo >> deploy\setup.sh
echo # Update system >> deploy\setup.sh
echo apt-get update >> deploy\setup.sh
echo apt-get upgrade -y >> deploy\setup.sh
echo >> deploy\setup.sh
echo # Install Node.js >> deploy\setup.sh
echo curl -fsSL https://deb.nodesource.com/setup_16.x ^| bash - >> deploy\setup.sh
echo apt-get install -y nodejs >> deploy\setup.sh
echo >> deploy\setup.sh
echo # Install MongoDB >> deploy\setup.sh
echo apt-get install -y mongodb >> deploy\setup.sh
echo systemctl start mongodb >> deploy\setup.sh
echo systemctl enable mongodb >> deploy\setup.sh
echo >> deploy\setup.sh
echo # Install PM2 >> deploy\setup.sh
echo npm install -g pm2 >> deploy\setup.sh
echo >> deploy\setup.sh
echo # Install dependencies >> deploy\setup.sh
echo cd /var/www/virtual-lawyer >> deploy\setup.sh
echo npm install --production >> deploy\setup.sh
echo >> deploy\setup.sh
echo # Create environment file >> deploy\setup.sh
echo cat ^> /var/www/virtual-lawyer/.env ^<^< EOL >> deploy\setup.sh
echo NODE_ENV=production >> deploy\setup.sh
echo PORT=5001 >> deploy\setup.sh
echo MONGODB_URI=mongodb://localhost:27017/virtual_lawyer >> deploy\setup.sh
echo JWT_SECRET=^$(openssl rand -hex 32) >> deploy\setup.sh
echo JWT_EXPIRE=30d >> deploy\setup.sh
echo JWT_COOKIE_EXPIRE=30 >> deploy\setup.sh
echo EOL >> deploy\setup.sh
echo >> deploy\setup.sh
echo # Start application with PM2 >> deploy\setup.sh
echo pm2 start server.js --name virtual-lawyer >> deploy\setup.sh
echo pm2 save >> deploy\setup.sh
echo pm2 startup >> deploy\setup.sh
echo >> deploy\setup.sh
echo # Install and configure Nginx >> deploy\setup.sh
echo apt-get install -y nginx >> deploy\setup.sh
echo >> deploy\setup.sh
echo # Create Nginx configuration >> deploy\setup.sh
echo cat ^> /etc/nginx/sites-available/virtual-lawyer ^<^< EOL >> deploy\setup.sh
echo server { >> deploy\setup.sh
echo     listen 80; >> deploy\setup.sh
echo     server_name _; >> deploy\setup.sh
echo >> deploy\setup.sh
echo     location / { >> deploy\setup.sh
echo         proxy_pass http://localhost:5001; >> deploy\setup.sh
echo         proxy_http_version 1.1; >> deploy\setup.sh
echo         proxy_set_header Upgrade \$http_upgrade; >> deploy\setup.sh
echo         proxy_set_header Connection 'upgrade'; >> deploy\setup.sh
echo         proxy_set_header Host \$host; >> deploy\setup.sh
echo         proxy_cache_bypass \$http_upgrade; >> deploy\setup.sh
echo     } >> deploy\setup.sh
echo } >> deploy\setup.sh
echo EOL >> deploy\setup.sh
echo >> deploy\setup.sh
echo # Enable Nginx configuration >> deploy\setup.sh
echo ln -sf /etc/nginx/sites-available/virtual-lawyer /etc/nginx/sites-enabled/ >> deploy\setup.sh
echo nginx -t >> deploy\setup.sh
echo systemctl restart nginx >> deploy\setup.sh
echo >> deploy\setup.sh
echo echo "Deployment complete! Your application is now available at http://$SERVER_IP" >> deploy\setup.sh

echo.
echo Step 3: Deploying to server...
echo.

echo This will deploy your application to the server.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Connecting to server...
echo.

echo Creating deployment directory on server...
echo %SERVER_PASS% | plink -ssh -P %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "mkdir -p /var/www/virtual-lawyer"

echo Copying files to server...
echo %SERVER_PASS% | pscp -P %SERVER_PORT% -r deploy\* %SERVER_USER%@%SERVER_IP%:/var/www/virtual-lawyer/

echo Running setup script...
echo %SERVER_PASS% | plink -ssh -P %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "cd /var/www/virtual-lawyer && chmod +x setup.sh && sudo ./setup.sh"

echo.
echo ===== Deployment Complete =====
echo.
echo Your application is now available at: http://%SERVER_IP%
echo.
echo To check the status of your application, run:
echo plink -ssh -P %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "pm2 status"
echo.
echo To view the logs, run:
echo plink -ssh -P %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "pm2 logs virtual-lawyer"
echo.
pause