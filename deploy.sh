#!/bin/bash

# Virtual Lawyer Deployment Script
# This script helps deploy the Virtual Lawyer application to a VPS

# Exit on error
set -e

echo "===== Virtual Lawyer Deployment Script ====="
echo "This script will help you deploy your application to a VPS."

# Check if server IP is provided
if [ -z "$1" ]; then
  read -p "Enter your server IP address: " SERVER_IP
else
  SERVER_IP=$1
fi

# Check if username is provided
if [ -z "$2" ]; then
  read -p "Enter your server username (default: root): " SERVER_USER
  SERVER_USER=${SERVER_USER:-root}
else
  SERVER_USER=$2
fi

echo "Deploying to $SERVER_IP as user $SERVER_USER..."

# Create deployment directory
echo "Creating deployment directory..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p ~/virtual-lawyer"

# Copy files to server
echo "Copying files to server..."
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' ./ $SERVER_USER@$SERVER_IP:~/virtual-lawyer/

# Copy environment file
echo "Copying environment file..."
scp .env.claude $SERVER_USER@$SERVER_IP:~/virtual-lawyer/.env

# Install dependencies and start application
echo "Installing dependencies and starting application..."
ssh $SERVER_USER@$SERVER_IP "cd ~/virtual-lawyer && \
  # Update system packages
  sudo apt update && \
  # Install Node.js if not installed
  command -v node > /dev/null || { \
    echo 'Installing Node.js...' && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
    sudo apt install -y nodejs; \
  } && \
  # Install MongoDB if not installed
  command -v mongod > /dev/null || { \
    echo 'Installing MongoDB...' && \
    sudo apt install -y mongodb && \
    sudo systemctl start mongodb && \
    sudo systemctl enable mongodb; \
  } && \
  # Install PM2 if not installed
  command -v pm2 > /dev/null || { \
    echo 'Installing PM2...' && \
    sudo npm install -g pm2; \
  } && \
  # Install dependencies
  npm install && \
  # Start application with PM2
  pm2 start ecosystem.config.js && \
  # Save PM2 configuration
  pm2 save && \
  # Setup PM2 to start on boot
  pm2 startup | tail -n 1 | bash"

# Setup Nginx
echo "Setting up Nginx..."
ssh $SERVER_USER@$SERVER_IP "
  # Install Nginx if not installed
  command -v nginx > /dev/null || { \
    echo 'Installing Nginx...' && \
    sudo apt install -y nginx; \
  } && \
  # Create Nginx configuration
  echo 'server {
    listen 80;
    server_name \$host;
    
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}' | sudo tee /etc/nginx/sites-available/virtual-lawyer > /dev/null && \
  # Enable site
  sudo ln -sf /etc/nginx/sites-available/virtual-lawyer /etc/nginx/sites-enabled/ && \
  # Test Nginx configuration
  sudo nginx -t && \
  # Restart Nginx
  sudo systemctl restart nginx"

echo "===== Deployment Complete ====="
echo "Your Virtual Lawyer application is now deployed to $SERVER_IP"
echo "You can access it at http://$SERVER_IP"
echo ""
echo "To set up SSL with Let's Encrypt, run the following commands on your server:"
echo "sudo apt install -y certbot python3-certbot-nginx"
echo "sudo certbot --nginx -d yourdomain.com"
echo ""
echo "To update your application in the future, run this script again."