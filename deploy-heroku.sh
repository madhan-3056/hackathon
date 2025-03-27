#!/bin/bash

# Virtual Lawyer Heroku Deployment Script
# This script helps deploy the Virtual Lawyer application to Heroku

# Exit on error
set -e

echo "===== Virtual Lawyer Heroku Deployment Script ====="
echo "This script will help you deploy your application to Heroku."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
  echo "Heroku CLI is not installed. Please install it first:"
  echo "On Ubuntu: sudo snap install --classic heroku"
  echo "On macOS: brew install heroku/brew/heroku"
  echo "On Windows: Download from https://devcenter.heroku.com/articles/heroku-cli"
  exit 1
fi

# Check if app name is provided
if [ -z "$1" ]; then
  read -p "Enter your Heroku app name (default: virtual-lawyer): " APP_NAME
  APP_NAME=${APP_NAME:-virtual-lawyer}
else
  APP_NAME=$1
fi

echo "Deploying to Heroku app: $APP_NAME..."

# Create Procfile if it doesn't exist
if [ ! -f "Procfile" ]; then
  echo "Creating Procfile..."
  echo "web: node server-combined.js" > Procfile
fi

# Login to Heroku
echo "Logging in to Heroku..."
heroku login

# Create Heroku app if it doesn't exist
if ! heroku apps:info --app $APP_NAME &> /dev/null; then
  echo "Creating Heroku app: $APP_NAME..."
  heroku create $APP_NAME
else
  echo "Using existing Heroku app: $APP_NAME..."
fi

# Add MongoDB add-on
echo "Adding MongoDB add-on..."
heroku addons:create mongolab:sandbox --app $APP_NAME || echo "MongoDB add-on already exists or couldn't be added"

# Set environment variables
echo "Setting environment variables..."
heroku config:set NODE_ENV=production --app $APP_NAME

# Get Claude API key from .env.claude
if [ -f ".env.claude" ]; then
  CLAUDE_API_KEY=$(grep CLAUDE_API_KEY .env.claude | cut -d '=' -f2)
  if [ ! -z "$CLAUDE_API_KEY" ]; then
    heroku config:set CLAUDE_API_KEY=$CLAUDE_API_KEY --app $APP_NAME
  else
    echo "CLAUDE_API_KEY not found in .env.claude"
    read -p "Enter your Claude API key: " CLAUDE_API_KEY
    heroku config:set CLAUDE_API_KEY=$CLAUDE_API_KEY --app $APP_NAME
  fi
else
  echo ".env.claude file not found"
  read -p "Enter your Claude API key: " CLAUDE_API_KEY
  heroku config:set CLAUDE_API_KEY=$CLAUDE_API_KEY --app $APP_NAME
fi

# Set JWT secret
JWT_SECRET=$(grep JWT_SECRET .env.claude | cut -d '=' -f2 || echo "")
if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET=$(openssl rand -hex 32)
fi
heroku config:set JWT_SECRET=$JWT_SECRET --app $APP_NAME
heroku config:set JWT_EXPIRE=30d --app $APP_NAME
heroku config:set JWT_COOKIE_EXPIRE=30 --app $APP_NAME

# Deploy to Heroku
echo "Deploying to Heroku..."
git add .
git commit -m "Prepare for Heroku deployment" || echo "No changes to commit"
git push heroku main || git push heroku master

# Open the app
echo "Opening the app..."
heroku open --app $APP_NAME

echo "===== Deployment Complete ====="
echo "Your Virtual Lawyer application is now deployed to Heroku"
echo "You can access it at https://$APP_NAME.herokuapp.com"
echo ""
echo "To view logs, run: heroku logs --tail --app $APP_NAME"
echo "To update your application in the future, run this script again."