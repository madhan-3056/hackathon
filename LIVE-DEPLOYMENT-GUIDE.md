# Live Server Deployment Guide

This guide will help you deploy the Virtual Lawyer application to a live server.

## Prerequisites

Before you begin, you'll need:

1. A server (VPS or dedicated) with:
   - Ubuntu 18.04 or higher
   - At least 1GB RAM
   - At least 10GB storage

2. SSH access to your server:
   - IP address
   - Username
   - Password or SSH key

3. (Optional) A domain name pointing to your server

## Deployment Options

### Option 1: Automated Deployment (Recommended)

The easiest way to deploy is using our automated deployment scripts:

1. Open Command Prompt or PowerShell in your project directory

2. Run the deployment script:
   ```
   deploy-live.bat
   ```

3. Follow the prompts to enter your server details:
   - Server IP address
   - Username
   - SSH port (usually 22)
   - Domain name (optional)

4. The script will:
   - Build your application
   - Copy files to your server
   - Install necessary dependencies
   - Configure Nginx
   - Set up SSL (if you provided a domain)
   - Start your application

5. Once complete, you can access your application at:
   - If you provided a domain: `https://your-domain.com`
   - If you didn't provide a domain: `http://your-server-ip`

### Option 2: Manual Deployment

If you prefer to deploy manually:

1. Build your application:
   ```
   cd frontend
   npm install
   npm run build
   cd ..
   ```

2. Copy your files to the server:
   ```
   scp -r * username@your-server-ip:/var/www/virtual-lawyer/
   ```

3. SSH into your server:
   ```
   ssh username@your-server-ip
   ```

4. Install dependencies:
   ```
   cd /var/www/virtual-lawyer
   
   # Update system
   sudo apt-get update
   sudo apt-get upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   sudo apt-get install -y mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install application dependencies
   npm install --production
   ```

5. Create environment file:
   ```
   cat > .env << EOL
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/virtual_lawyer
   JWT_SECRET=$(openssl rand -hex 32)
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   EOL
   ```

6. Start the application:
   ```
   pm2 start server.js --name virtual-lawyer
   pm2 save
   pm2 startup
   sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER
   ```

7. Install and configure Nginx:
   ```
   sudo apt-get install -y nginx
   
   sudo cat > /etc/nginx/sites-available/virtual-lawyer << EOL
   server {
       listen 80;
       server_name your-domain.com;  # Replace with your domain or server IP
       
       location / {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   EOL
   
   sudo ln -sf /etc/nginx/sites-available/virtual-lawyer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. (Optional) Set up SSL with Let's Encrypt:
   ```
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   sudo systemctl restart nginx
   ```

## Accessing Your Application

After deployment, you can access your application at:

- If you provided a domain: `https://your-domain.com`
- If you didn't provide a domain: `http://your-server-ip`

## Troubleshooting

If you encounter issues during deployment:

1. **Connection issues**:
   - Make sure your server IP, username, and SSH port are correct
   - Check if your server firewall allows SSH connections

2. **Application not starting**:
   - Check the application logs: `pm2 logs virtual-lawyer`
   - Make sure MongoDB is running: `sudo systemctl status mongodb`

3. **Cannot access the application**:
   - Check if Nginx is running: `sudo systemctl status nginx`
   - Make sure ports 80 and 443 are open in your server firewall
   - Check Nginx error logs: `sudo cat /var/log/nginx/error.log`

4. **SSL certificate issues**:
   - Make sure your domain is correctly pointing to your server
   - Check Let's Encrypt logs: `sudo certbot certificates`

## Managing Your Application

- **View application status**: `pm2 status`
- **View application logs**: `pm2 logs virtual-lawyer`
- **Restart application**: `pm2 restart virtual-lawyer`
- **Stop application**: `pm2 stop virtual-lawyer`
- **Start application**: `pm2 start virtual-lawyer`

## Need More Help?

If you need more help with deployment, please contact our support team or refer to the documentation for the specific tools used:

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)