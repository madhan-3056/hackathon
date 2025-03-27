@echo off
echo ===== Deploying Virtual Lawyer to Live Server =====
echo.

set /p SERVER_IP="Enter your server IP address: "
set /p SERVER_USER="Enter your server username: "
set /p SERVER_PORT="Enter your server SSH port (default: 22): "
if "%SERVER_PORT%"=="" set SERVER_PORT=22
set /p DOMAIN="Enter your domain name (leave blank to use IP address): "

echo.
echo Server IP: %SERVER_IP%
echo Username: %SERVER_USER%
echo SSH Port: %SERVER_PORT%
echo Domain: %DOMAIN%
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
echo Step 2: Creating deployment files...
echo.

echo Creating deploy.sh script...
echo #!/bin/bash > deploy.sh
echo >> deploy.sh
echo # Server setup and deployment script >> deploy.sh
echo >> deploy.sh
echo # Update system >> deploy.sh
echo echo "Updating system packages..." >> deploy.sh
echo sudo apt-get update >> deploy.sh
echo sudo apt-get upgrade -y >> deploy.sh
echo >> deploy.sh
echo # Install Node.js >> deploy.sh
echo echo "Installing Node.js..." >> deploy.sh
echo curl -fsSL https://deb.nodesource.com/setup_16.x ^| sudo -E bash - >> deploy.sh
echo sudo apt-get install -y nodejs >> deploy.sh
echo >> deploy.sh
echo # Install MongoDB >> deploy.sh
echo echo "Installing MongoDB..." >> deploy.sh
echo sudo apt-get install -y mongodb >> deploy.sh
echo sudo systemctl start mongodb >> deploy.sh
echo sudo systemctl enable mongodb >> deploy.sh
echo >> deploy.sh
echo # Install PM2 >> deploy.sh
echo echo "Installing PM2..." >> deploy.sh
echo sudo npm install -g pm2 >> deploy.sh
echo >> deploy.sh
echo # Create application directory >> deploy.sh
echo echo "Creating application directory..." >> deploy.sh
echo sudo mkdir -p /var/www/virtual-lawyer >> deploy.sh
echo sudo chown -R $USER:$USER /var/www/virtual-lawyer >> deploy.sh
echo >> deploy.sh
echo # Copy application files >> deploy.sh
echo echo "Copying application files..." >> deploy.sh
echo cp -r * /var/www/virtual-lawyer/ >> deploy.sh
echo >> deploy.sh
echo # Install dependencies >> deploy.sh
echo echo "Installing dependencies..." >> deploy.sh
echo cd /var/www/virtual-lawyer >> deploy.sh
echo npm install --production >> deploy.sh
echo >> deploy.sh
echo # Create environment file >> deploy.sh
echo echo "Creating environment file..." >> deploy.sh
echo cat ^> /var/www/virtual-lawyer/.env ^<^< EOL >> deploy.sh
echo NODE_ENV=production >> deploy.sh
echo PORT=5001 >> deploy.sh
echo MONGODB_URI=mongodb://localhost:27017/virtual_lawyer >> deploy.sh
echo JWT_SECRET=^$(openssl rand -hex 32) >> deploy.sh
echo JWT_EXPIRE=30d >> deploy.sh
echo JWT_COOKIE_EXPIRE=30 >> deploy.sh
echo EOL >> deploy.sh
echo >> deploy.sh
echo # Start application with PM2 >> deploy.sh
echo echo "Starting application with PM2..." >> deploy.sh
echo cd /var/www/virtual-lawyer >> deploy.sh
echo pm2 start server.js --name virtual-lawyer >> deploy.sh
echo pm2 save >> deploy.sh
echo pm2 startup >> deploy.sh
echo sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER >> deploy.sh
echo >> deploy.sh
echo # Install and configure Nginx >> deploy.sh
echo echo "Installing and configuring Nginx..." >> deploy.sh
echo sudo apt-get install -y nginx >> deploy.sh
echo >> deploy.sh

if not "%DOMAIN%"=="" (
    echo # Create Nginx configuration with domain >> deploy.sh
    echo sudo cat ^> /etc/nginx/sites-available/virtual-lawyer ^<^< EOL >> deploy.sh
    echo server { >> deploy.sh
    echo     listen 80; >> deploy.sh
    echo     server_name %DOMAIN%; >> deploy.sh
    echo >> deploy.sh
    echo     location / { >> deploy.sh
    echo         proxy_pass http://localhost:5001; >> deploy.sh
    echo         proxy_http_version 1.1; >> deploy.sh
    echo         proxy_set_header Upgrade \$http_upgrade; >> deploy.sh
    echo         proxy_set_header Connection 'upgrade'; >> deploy.sh
    echo         proxy_set_header Host \$host; >> deploy.sh
    echo         proxy_cache_bypass \$http_upgrade; >> deploy.sh
    echo     } >> deploy.sh
    echo } >> deploy.sh
    echo EOL >> deploy.sh
) else (
    echo # Create Nginx configuration with IP >> deploy.sh
    echo sudo cat ^> /etc/nginx/sites-available/virtual-lawyer ^<^< EOL >> deploy.sh
    echo server { >> deploy.sh
    echo     listen 80; >> deploy.sh
    echo     server_name %SERVER_IP%; >> deploy.sh
    echo >> deploy.sh
    echo     location / { >> deploy.sh
    echo         proxy_pass http://localhost:5001; >> deploy.sh
    echo         proxy_http_version 1.1; >> deploy.sh
    echo         proxy_set_header Upgrade \$http_upgrade; >> deploy.sh
    echo         proxy_set_header Connection 'upgrade'; >> deploy.sh
    echo         proxy_set_header Host \$host; >> deploy.sh
    echo         proxy_cache_bypass \$http_upgrade; >> deploy.sh
    echo     } >> deploy.sh
    echo } >> deploy.sh
    echo EOL >> deploy.sh
)

echo >> deploy.sh
echo # Enable Nginx configuration >> deploy.sh
echo sudo ln -sf /etc/nginx/sites-available/virtual-lawyer /etc/nginx/sites-enabled/ >> deploy.sh
echo sudo nginx -t >> deploy.sh
echo sudo systemctl restart nginx >> deploy.sh
echo >> deploy.sh

if not "%DOMAIN%"=="" (
    echo # Install SSL certificate >> deploy.sh
    echo echo "Installing SSL certificate..." >> deploy.sh
    echo sudo apt-get install -y certbot python3-certbot-nginx >> deploy.sh
    echo sudo certbot --nginx -d %DOMAIN% --non-interactive --agree-tos --email admin@%DOMAIN% >> deploy.sh
    echo sudo systemctl restart nginx >> deploy.sh
    echo >> deploy.sh
)

echo # Print success message >> deploy.sh
if not "%DOMAIN%"=="" (
    echo echo "Deployment complete! Your application is now available at https://%DOMAIN%" >> deploy.sh
) else (
    echo echo "Deployment complete! Your application is now available at http://%SERVER_IP%" >> deploy.sh
)

echo.
echo Step 3: Copying files to server...
echo.

echo This will copy files to your server and run the deployment script.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Copying files to server...
echo y | plink -ssh -P %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "mkdir -p ~/virtual-lawyer-deploy"

echo Uploading frontend build...
pscp -P %SERVER_PORT% -r frontend/build/* %SERVER_USER%@%SERVER_IP%:~/virtual-lawyer-deploy/frontend/build/

echo Uploading backend files...
pscp -P %SERVER_PORT% -r backend/* %SERVER_USER%@%SERVER_IP%:~/virtual-lawyer-deploy/backend/

echo Uploading package.json and server.js...
pscp -P %SERVER_PORT% package.json %SERVER_USER%@%SERVER_IP%:~/virtual-lawyer-deploy/
pscp -P %SERVER_PORT% server.js %SERVER_USER%@%SERVER_IP%:~/virtual-lawyer-deploy/

echo Uploading deployment script...
pscp -P %SERVER_PORT% deploy.sh %SERVER_USER%@%SERVER_IP%:~/virtual-lawyer-deploy/

echo.
echo Step 4: Running deployment script on server...
echo.

echo Running deployment script...
plink -ssh -P %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "cd ~/virtual-lawyer-deploy && chmod +x deploy.sh && ./deploy.sh"

echo.
echo ===== Deployment Complete =====
echo.
if not "%DOMAIN%"=="" (
    echo Your application is now available at: https://%DOMAIN%
) else (
    echo Your application is now available at: http://%SERVER_IP%
)
echo.
echo To check the status of your application, run:
echo plink -ssh -P %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "pm2 status"
echo.
echo To view the logs, run:
echo plink -ssh -P %SERVER_PORT% %SERVER_USER%@%SERVER_IP% "pm2 logs virtual-lawyer"
echo.
pause