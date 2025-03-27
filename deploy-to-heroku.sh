#!/bin/bash

echo "===== Deploying Virtual Lawyer to Heroku ====="
echo
echo "This script will guide you through deploying your application to Heroku"
echo
echo "Prerequisites:"
echo "1. A Heroku account"
echo "2. Heroku CLI installed on your computer"
echo "3. Git installed on your computer"
echo
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo
echo "Step 1: Preparing your application for deployment..."
echo

echo "Checking if Heroku CLI is installed..."
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI is not installed. Please install it and try again."
    echo "You can download it from https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

echo "Checking if Git is installed..."
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git and try again."
    echo "You can download Git from https://git-scm.com/downloads"
    exit 1
fi

echo
echo "Step 2: Setting up Heroku application..."
echo

read -p "Enter a name for your Heroku application (e.g., virtual-lawyer): " app_name

echo "Creating Heroku application..."
heroku create $app_name

echo
echo "Step 3: Setting up Git repository..."
echo

if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    
    echo "Creating .gitignore file..."
    echo "node_modules" > .gitignore
    echo ".env" >> .gitignore
    echo ".DS_Store" >> .gitignore
    echo "npm-debug.log" >> .gitignore
    echo "/frontend/node_modules" >> .gitignore
    
    echo "Adding files to Git..."
    git add .
    
    echo "Creating initial commit..."
    git commit -m "Initial commit for Heroku deployment"
else
    echo "Git repository already exists."
    
    echo "Adding any new files to Git..."
    git add .
    
    echo "Creating deployment commit..."
    git commit -m "Heroku deployment update"
fi

echo
echo "Step 4: Setting up environment variables..."
echo

echo "Setting up environment variables on Heroku..."
heroku config:set NODE_ENV=production --app $app_name

read -p "Enter your MongoDB URI (or press Enter to skip): " mongodb_uri
if [ ! -z "$mongodb_uri" ]; then
    heroku config:set MONGODB_URI="$mongodb_uri" --app $app_name
fi

read -p "Enter a JWT secret key (or press Enter to generate one): " jwt_secret
if [ -z "$jwt_secret" ]; then
    jwt_secret=$(openssl rand -hex 16)
fi
heroku config:set JWT_SECRET="$jwt_secret" --app $app_name

heroku config:set JWT_EXPIRE=30d --app $app_name
heroku config:set JWT_COOKIE_EXPIRE=30 --app $app_name

echo
echo "Step 5: Building the frontend..."
echo

echo "Building the frontend..."
cd frontend
npm install
npm run build
cd ..

echo
echo "Step 6: Deploying to Heroku..."
echo

echo "Adding Heroku remote..."
git remote add heroku https://git.heroku.com/$app_name.git

echo "Pushing code to Heroku..."
git push heroku master

echo
echo "Deployment complete!"
echo
echo "Your application is now available at: https://$app_name.herokuapp.com"
echo
read -p "Press Enter to exit..."