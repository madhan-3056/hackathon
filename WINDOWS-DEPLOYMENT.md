# Windows Deployment Guide for Virtual Lawyer

This guide provides step-by-step instructions for deploying the Virtual Lawyer application from a Windows machine.

## Option 1: Deploy Locally with Docker

This is the easiest method if you want to run the application on your local machine.

### Prerequisites:
- Docker Desktop installed on your Windows machine
- Git installed

### Steps:

1. Make sure Docker Desktop is running.

2. Open Command Prompt or PowerShell in your project directory.

3. Build and start the Docker containers:
   ```
   docker-compose up -d
   ```

4. Access your application at http://localhost:5001

5. To stop the application:
   ```
   docker-compose down
   ```

## Option 2: Deploy to a Remote Server

### Prerequisites:
- SSH client installed (OpenSSH or PuTTY)
- Git installed

### Steps:

1. Open Command Prompt or PowerShell in your project directory.

2. If you have OpenSSH installed, you can use the deploy.sh script with WSL (Windows Subsystem for Linux):
   ```
   wsl chmod +x deploy.sh
   wsl ./deploy.sh your-server-ip your-username
   ```

3. If you don't have WSL, you can manually deploy:
   
   a. Copy your files to the server using SCP or SFTP:
      ```
      scp -r * your-username@your-server-ip:~/virtual-lawyer/
      ```
   
   b. SSH into your server:
      ```
      ssh your-username@your-server-ip
      ```
   
   c. Follow these commands on the server:
      ```
      cd ~/virtual-lawyer
      
      # Install Node.js
      curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
      sudo apt install -y nodejs
      
      # Install MongoDB
      sudo apt install -y mongodb
      sudo systemctl start mongodb
      sudo systemctl enable mongodb
      
      # Install PM2
      sudo npm install -g pm2
      
      # Install dependencies
      npm install
      
      # Start application with PM2
      pm2 start ecosystem.config.js
      pm2 save
      pm2 startup
      
      # Setup Nginx
      sudo apt install -y nginx
      sudo nano /etc/nginx/sites-available/virtual-lawyer
      ```
   
   d. Add this Nginx configuration:
      ```
      server {
          listen 80;
          server_name $host;
          
          location / {
              proxy_pass http://localhost:5001;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection "upgrade";
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
          }
      }
      ```
   
   e. Enable the Nginx site:
      ```
      sudo ln -sf /etc/nginx/sites-available/virtual-lawyer /etc/nginx/sites-enabled/
      sudo nginx -t
      sudo systemctl restart nginx
      ```

## Option 3: Deploy to Heroku

### Prerequisites:
- Heroku CLI installed
- Git installed

### Steps:

1. Open Command Prompt or PowerShell in your project directory.

2. Login to Heroku:
   ```
   heroku login
   ```

3. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```

4. Set environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set CLAUDE_API_KEY=your-claude-api-key
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set JWT_EXPIRE=30d
   heroku config:set JWT_COOKIE_EXPIRE=30
   ```

5. Add MongoDB add-on:
   ```
   heroku addons:create mongolab:sandbox
   ```

6. Deploy to Heroku:
   ```
   git push heroku main
   ```

7. Open your application:
   ```
   heroku open
   ```

## Troubleshooting

If you encounter issues during deployment:

1. **Docker issues**:
   - Make sure Docker Desktop is running
   - Check Docker logs: `docker-compose logs`
   - Try rebuilding: `docker-compose up -d --build`

2. **SSH issues**:
   - Make sure you have the correct server IP and username
   - Check if your SSH key is properly set up
   - Try using password authentication if key authentication fails

3. **Heroku issues**:
   - Check Heroku logs: `heroku logs --tail`
   - Make sure all environment variables are set correctly
   - Make sure you're pushing to the correct Heroku app

4. **Application issues**:
   - Check application logs
   - Make sure MongoDB is running
   - Make sure all environment variables are set correctly

## Need More Help?

If you need more help with deployment, please refer to the main [DEPLOYMENT.md](DEPLOYMENT.md) file or contact the development team.