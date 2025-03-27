#!/bin/bash

# Script to connect to your live server and perform common tasks

# Exit on error
set -e

echo "===== Virtual Lawyer Server Connection Tool ====="

# Check if server details are provided as arguments or prompt for them
if [ -z "$1" ]; then
  read -p "Enter your server IP address: " SERVER_IP
else
  SERVER_IP=$1
fi

if [ -z "$2" ]; then
  read -p "Enter your server username: " SERVER_USER
else
  SERVER_USER=$2
fi

if [ -z "$3" ]; then
  read -p "Enter your server SSH port (default: 22): " SERVER_PORT
  SERVER_PORT=${SERVER_PORT:-22}
else
  SERVER_PORT=$3
fi

# Display menu
echo ""
echo "Connected to $SERVER_IP as $SERVER_USER"
echo ""
echo "Choose an action:"
echo "1. SSH into server"
echo "2. View application logs"
echo "3. Restart application"
echo "4. Check application status"
echo "5. Update application"
echo "6. Backup database"
echo "7. View server resources"
echo "8. Check SSL certificate"
echo "9. Exit"
echo ""

read -p "Enter your choice (1-9): " CHOICE

case $CHOICE in
  1)
    echo "Connecting to server via SSH..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP
    ;;
  2)
    echo "Viewing application logs..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd ~/virtual-lawyer && pm2 logs --lines 100"
    ;;
  3)
    echo "Restarting application..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd ~/virtual-lawyer && pm2 restart all"
    echo "Application restarted successfully!"
    ;;
  4)
    echo "Checking application status..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd ~/virtual-lawyer && pm2 status"
    ;;
  5)
    echo "Updating application..."
    echo "This will copy your local files to the server and restart the application."
    read -p "Are you sure you want to continue? (y/n): " CONFIRM
    if [ "$CONFIRM" = "y" ]; then
      rsync -avz -e "ssh -p $SERVER_PORT" --exclude 'node_modules' --exclude '.git' --exclude '.env' ./ $SERVER_USER@$SERVER_IP:~/virtual-lawyer/
      ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd ~/virtual-lawyer && npm install && pm2 restart all"
      echo "Application updated successfully!"
    else
      echo "Update cancelled."
    fi
    ;;
  6)
    echo "Backing up database..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "mkdir -p ~/mongodb-backups && mongodump --out ~/mongodb-backups/\$(date +%Y%m%d_%H%M%S)"
    echo "Database backed up successfully!"
    ;;
  7)
    echo "Viewing server resources..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "echo 'CPU and Memory Usage:' && top -bn1 | head -15 && echo '' && echo 'Disk Usage:' && df -h && echo '' && echo 'Memory Info:' && free -h"
    ;;
  8)
    echo "Checking SSL certificate..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "sudo certbot certificates"
    ;;
  9)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "Invalid choice. Exiting..."
    exit 1
    ;;
esac

echo ""
echo "===== Operation Complete ====="