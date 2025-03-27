@echo off
echo ===== Deploying Virtual Lawyer to Live Server via FTP =====
echo.

set /p FTP_HOST="Enter FTP host (e.g., ftp.example.com): "
set /p FTP_USER="Enter FTP username: "
set /p FTP_PASS="Enter FTP password: "
set /p FTP_DIR="Enter FTP directory (e.g., /public_html): "

echo.
echo Step 1: Building the application for deployment...
call build-for-deployment.bat

echo.
echo Step 2: Creating FTP script...
echo open %FTP_HOST% > ftpscript.txt
echo %FTP_USER% >> ftpscript.txt
echo %FTP_PASS% >> ftpscript.txt
echo cd %FTP_DIR% >> ftpscript.txt
echo mkdir virtual-lawyer >> ftpscript.txt
echo cd virtual-lawyer >> ftpscript.txt
echo lcd . >> ftpscript.txt
echo prompt >> ftpscript.txt
echo mput *.js >> ftpscript.txt
echo mput *.json >> ftpscript.txt
echo mkdir config >> ftpscript.txt
echo cd config >> ftpscript.txt
echo lcd config >> ftpscript.txt
echo mput *.js >> ftpscript.txt
echo cd .. >> ftpscript.txt
echo lcd .. >> ftpscript.txt
echo mkdir controllers >> ftpscript.txt
echo cd controllers >> ftpscript.txt
echo lcd controllers >> ftpscript.txt
echo mput *.js >> ftpscript.txt
echo cd .. >> ftpscript.txt
echo lcd .. >> ftpscript.txt
echo mkdir middlewares >> ftpscript.txt
echo cd middlewares >> ftpscript.txt
echo lcd middlewares >> ftpscript.txt
echo mput *.js >> ftpscript.txt
echo cd .. >> ftpscript.txt
echo lcd .. >> ftpscript.txt
echo mkdir models >> ftpscript.txt
echo cd models >> ftpscript.txt
echo lcd models >> ftpscript.txt
echo mput *.js >> ftpscript.txt
echo cd .. >> ftpscript.txt
echo lcd .. >> ftpscript.txt
echo mkdir routes >> ftpscript.txt
echo cd routes >> ftpscript.txt
echo lcd routes >> ftpscript.txt
echo mput *.js >> ftpscript.txt
echo cd .. >> ftpscript.txt
echo lcd .. >> ftpscript.txt
echo mkdir services >> ftpscript.txt
echo cd services >> ftpscript.txt
echo lcd services >> ftpscript.txt
echo mput *.js >> ftpscript.txt
echo cd .. >> ftpscript.txt
echo lcd .. >> ftpscript.txt
echo mkdir frontend >> ftpscript.txt
echo cd frontend >> ftpscript.txt
echo lcd frontend >> ftpscript.txt
echo mkdir build >> ftpscript.txt
echo cd build >> ftpscript.txt
echo lcd build >> ftpscript.txt
echo mput *.* >> ftpscript.txt
echo mkdir static >> ftpscript.txt
echo cd static >> ftpscript.txt
echo lcd static >> ftpscript.txt
echo mkdir css >> ftpscript.txt
echo cd css >> ftpscript.txt
echo lcd css >> ftpscript.txt
echo mput *.* >> ftpscript.txt
echo cd .. >> ftpscript.txt
echo lcd .. >> ftpscript.txt
echo mkdir js >> ftpscript.txt
echo cd js >> ftpscript.txt
echo lcd js >> ftpscript.txt
echo mput *.* >> ftpscript.txt
echo cd .. >> ftpscript.txt
echo lcd .. >> ftpscript.txt
echo mkdir media >> ftpscript.txt
echo cd media >> ftpscript.txt
echo lcd media >> ftpscript.txt
echo mput *.* >> ftpscript.txt
echo cd .. >> ftpscript.txt
echo lcd .. >> ftpscript.txt
echo bye >> ftpscript.txt

echo.
echo Step 3: Uploading files to FTP server...
ftp -s:ftpscript.txt

echo.
echo Step 4: Cleaning up...
del ftpscript.txt

echo.
echo ===== Deployment Complete =====
echo.
echo Your application has been deployed to your FTP server!
echo.
echo Note: You'll need to set up Node.js and MongoDB on your server,
echo and configure your server to run the application.
echo.
echo Would you like to create a server setup guide? (y/n)
set /p CREATE_GUIDE=
if /i "%CREATE_GUIDE%"=="y" (
    echo Creating server setup guide...
    echo # Server Setup Guide > SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo ## Prerequisites >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo - Node.js (v14 or higher) >> SERVER-SETUP-GUIDE.md
    echo - MongoDB >> SERVER-SETUP-GUIDE.md
    echo - PM2 (for process management) >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo ## Installation Steps >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 1. Install Node.js: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - >> SERVER-SETUP-GUIDE.md
    echo    sudo apt-get install -y nodejs >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 2. Install MongoDB: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    sudo apt-get install -y mongodb >> SERVER-SETUP-GUIDE.md
    echo    sudo systemctl start mongodb >> SERVER-SETUP-GUIDE.md
    echo    sudo systemctl enable mongodb >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 3. Install PM2: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    sudo npm install -g pm2 >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 4. Navigate to your application directory: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    cd %FTP_DIR%/virtual-lawyer >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 5. Install dependencies: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    npm install >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 6. Create a .env file: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    echo "NODE_ENV=production" > .env >> SERVER-SETUP-GUIDE.md
    echo    echo "PORT=5001" >> .env >> SERVER-SETUP-GUIDE.md
    echo    echo "MONGODB_URI=mongodb://localhost:27017/virtual_lawyer" >> .env >> SERVER-SETUP-GUIDE.md
    echo    echo "JWT_SECRET=your_jwt_secret" >> .env >> SERVER-SETUP-GUIDE.md
    echo    echo "JWT_EXPIRE=30d" >> .env >> SERVER-SETUP-GUIDE.md
    echo    echo "JWT_COOKIE_EXPIRE=30" >> .env >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 7. Start the application with PM2: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    pm2 start server-combined.js --name virtual-lawyer >> SERVER-SETUP-GUIDE.md
    echo    pm2 save >> SERVER-SETUP-GUIDE.md
    echo    pm2 startup >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 8. Set up Nginx as a reverse proxy: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    sudo apt-get install -y nginx >> SERVER-SETUP-GUIDE.md
    echo    sudo nano /etc/nginx/sites-available/virtual-lawyer >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo    Add the following configuration: >> SERVER-SETUP-GUIDE.md
    echo    ```nginx >> SERVER-SETUP-GUIDE.md
    echo    server { >> SERVER-SETUP-GUIDE.md
    echo        listen 80; >> SERVER-SETUP-GUIDE.md
    echo        server_name your-domain.com; >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo        location / { >> SERVER-SETUP-GUIDE.md
    echo            proxy_pass http://localhost:5001; >> SERVER-SETUP-GUIDE.md
    echo            proxy_http_version 1.1; >> SERVER-SETUP-GUIDE.md
    echo            proxy_set_header Upgrade $http_upgrade; >> SERVER-SETUP-GUIDE.md
    echo            proxy_set_header Connection 'upgrade'; >> SERVER-SETUP-GUIDE.md
    echo            proxy_set_header Host $host; >> SERVER-SETUP-GUIDE.md
    echo            proxy_cache_bypass $http_upgrade; >> SERVER-SETUP-GUIDE.md
    echo        } >> SERVER-SETUP-GUIDE.md
    echo    } >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 9. Enable the Nginx configuration: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    sudo ln -s /etc/nginx/sites-available/virtual-lawyer /etc/nginx/sites-enabled/ >> SERVER-SETUP-GUIDE.md
    echo    sudo nginx -t >> SERVER-SETUP-GUIDE.md
    echo    sudo systemctl restart nginx >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo 10. Set up SSL with Let's Encrypt: >> SERVER-SETUP-GUIDE.md
    echo    ```bash >> SERVER-SETUP-GUIDE.md
    echo    sudo apt-get install -y certbot python3-certbot-nginx >> SERVER-SETUP-GUIDE.md
    echo    sudo certbot --nginx -d your-domain.com >> SERVER-SETUP-GUIDE.md
    echo    ``` >> SERVER-SETUP-GUIDE.md
    echo >> SERVER-SETUP-GUIDE.md
    echo Your application should now be accessible at https://your-domain.com >> SERVER-SETUP-GUIDE.md
    echo.
    echo Server setup guide created: SERVER-SETUP-GUIDE.md
)

echo.
pause