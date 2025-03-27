#!/bin/bash

# Virtual Lawyer Docker Deployment Script
# This script helps deploy the Virtual Lawyer application using Docker

# Exit on error
set -e

echo "===== Virtual Lawyer Docker Deployment Script ====="
echo "This script will help you deploy your application using Docker."

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
rsync -avz --exclude 'node_modules' --exclude '.git' ./ $SERVER_USER@$SERVER_IP:~/virtual-lawyer/

# Copy environment file
echo "Copying environment file..."
scp .env.claude $SERVER_USER@$SERVER_IP:~/virtual-lawyer/.env

# Install Docker and Docker Compose if not installed
echo "Installing Docker and Docker Compose if needed..."
ssh $SERVER_USER@$SERVER_IP "
  # Install Docker if not installed
  command -v docker > /dev/null || { \
    echo 'Installing Docker...' && \
    sudo apt update && \
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - && \
    sudo add-apt-repository 'deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable' && \
    sudo apt update && \
    sudo apt install -y docker-ce; \
  } && \
  # Install Docker Compose if not installed
  command -v docker-compose > /dev/null || { \
    echo 'Installing Docker Compose...' && \
    sudo curl -L \"https://github.com/docker/compose/releases/download/1.29.2/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose && \
    sudo chmod +x /usr/local/bin/docker-compose; \
  } && \
  # Add current user to docker group
  sudo usermod -aG docker \$USER"

# Deploy with Docker Compose
echo "Deploying with Docker Compose..."
ssh $SERVER_USER@$SERVER_IP "cd ~/virtual-lawyer && \
  # Export environment variables
  export CLAUDE_API_KEY=\$(grep CLAUDE_API_KEY .env | cut -d '=' -f2) && \
  # Build and start containers
  docker-compose up -d --build"

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
echo "Your Virtual Lawyer application is now deployed to $SERVER_IP using Docker"
echo "You can access it at http://$SERVER_IP"
echo ""
echo "To set up SSL with Let's Encrypt, run the following commands on your server:"
echo "sudo apt install -y certbot python3-certbot-nginx"
echo "sudo certbot --nginx -d yourdomain.com"
echo ""
echo "To update your application in the future, run this script again."