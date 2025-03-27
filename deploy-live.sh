#!/bin/bash

# Virtual Lawyer Live Server Deployment Script
# This script deploys the application to a live production server

# Exit on error
set -e

echo "===== Virtual Lawyer Live Server Deployment ====="

# Check if server details are provided as arguments or prompt for them
if [ -z "$1" ]; then
  read -p "Enter your live server IP address: " SERVER_IP
else
  SERVER_IP=$1
fi

if [ -z "$2" ]; then
  read -p "Enter your live server username: " SERVER_USER
else
  SERVER_USER=$2
fi

if [ -z "$3" ]; then
  read -p "Enter your live server SSH port (default: 22): " SERVER_PORT
  SERVER_PORT=${SERVER_PORT:-22}
else
  SERVER_PORT=$3
fi

if [ -z "$4" ]; then
  read -p "Enter your domain name (e.g., virtuallawyer.com): " DOMAIN_NAME
else
  DOMAIN_NAME=$4
fi

echo "Deploying to live server at $SERVER_IP:$SERVER_PORT as $SERVER_USER with domain $DOMAIN_NAME"

# Create deployment directory
echo "Creating deployment directory on live server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "mkdir -p ~/virtual-lawyer"

# Build the application for deployment
echo "Building application for deployment..."
./build-for-deployment.sh

# Copy files to server
echo "Copying application files to live server..."
rsync -avz -e "ssh -p $SERVER_PORT" --exclude 'node_modules' --exclude '.git' --exclude '.env' --exclude 'frontend/node_modules' ./ $SERVER_USER@$SERVER_IP:~/virtual-lawyer/

# Copy environment file
echo "Setting up environment variables on live server..."
scp -P $SERVER_PORT .env.claude $SERVER_USER@$SERVER_IP:~/virtual-lawyer/.env

# Install dependencies and set up the application
echo "Setting up the application on live server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd ~/virtual-lawyer && \
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

# Setup Nginx with SSL
echo "Setting up Nginx with SSL on live server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "
  # Install Nginx if not installed
  command -v nginx > /dev/null || { \
    echo 'Installing Nginx...' && \
    sudo apt install -y nginx; \
  } && \
  # Create Nginx configuration
  echo 'server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
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
  # Remove default site if exists
  sudo rm -f /etc/nginx/sites-enabled/default && \
  # Test Nginx configuration
  sudo nginx -t && \
  # Restart Nginx
  sudo systemctl restart nginx"

# Install SSL certificate with Let's Encrypt
echo "Installing SSL certificate with Let's Encrypt..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "
  # Install Certbot if not installed
  command -v certbot > /dev/null || { \
    echo 'Installing Certbot...' && \
    sudo apt install -y certbot python3-certbot-nginx; \
  } && \
  # Get SSL certificate
  sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos --email admin@$DOMAIN_NAME || echo 'SSL setup failed, please run manually'"

# Setup firewall
echo "Setting up firewall on live server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "
  # Install UFW if not installed
  command -v ufw > /dev/null || { \
    echo 'Installing UFW...' && \
    sudo apt install -y ufw; \
  } && \
  # Configure UFW
  sudo ufw allow ssh && \
  sudo ufw allow http && \
  sudo ufw allow https && \
  # Enable UFW if not already enabled
  sudo ufw status | grep -q 'Status: active' || { \
    echo 'Enabling UFW...' && \
    sudo ufw --force enable; \
  }"

# Setup monitoring with PM2
echo "Setting up monitoring with PM2..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "
  # Install PM2 monitoring
  pm2 install pm2-logrotate && \
  pm2 set pm2-logrotate:max_size 10M && \
  pm2 set pm2-logrotate:retain 7"

# Setup automatic updates
echo "Setting up automatic security updates..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "
  # Install unattended-upgrades if not installed
  command -v unattended-upgrade > /dev/null || { \
    echo 'Installing unattended-upgrades...' && \
    sudo apt install -y unattended-upgrades apt-listchanges; \
  } && \
  # Configure unattended-upgrades
  echo 'APT::Periodic::Update-Package-Lists \"1\";
APT::Periodic::Unattended-Upgrade \"1\";
APT::Periodic::AutocleanInterval \"7\";' | sudo tee /etc/apt/apt.conf.d/20auto-upgrades > /dev/null"

echo "===== Live Server Deployment Complete ====="
echo "Your Virtual Lawyer application is now deployed to your live server!"
echo "You can access it at https://$DOMAIN_NAME"
echo ""
echo "To monitor your application, run:"
echo "ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP \"pm2 monit\""
echo ""
echo "To view logs, run:"
echo "ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP \"pm2 logs\""
echo ""
echo "To update your application in the future, run this script again."