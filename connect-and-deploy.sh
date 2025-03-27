#!/bin/bash

echo "===== Virtual Lawyer Connect and Deploy ====="
echo

echo "Step 1: Building the application for deployment..."
./build-for-deployment.sh

echo
echo "Step 2: Testing the connection between frontend and backend..."
node test-connection.js

echo
echo "Step 3: Deploying to a live server..."
read -p "Enter your server IP address: " SERVER_IP
read -p "Enter your server username: " SERVER_USER
read -p "Enter your server SSH port (default: 22): " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-22}
read -p "Enter your domain name (e.g., virtuallawyer.com): " DOMAIN_NAME

./deploy-live.sh $SERVER_IP $SERVER_USER $SERVER_PORT $DOMAIN_NAME

echo
echo "===== Connect and Deploy Complete ====="
echo