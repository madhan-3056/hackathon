#!/bin/bash

echo "===== Deploying Virtual Lawyer to Render ====="
echo
echo "This script will guide you through deploying your application to Render.com"
echo
echo "Prerequisites:"
echo "1. A Render.com account"
echo "2. Git installed on your computer"
echo "3. A GitHub, GitLab, or Bitbucket account"
echo
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo
echo "Step 1: Preparing your application for deployment..."
echo

echo "Checking if Git is installed..."
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git and try again."
    echo "You can download Git from https://git-scm.com/downloads"
    exit 1
fi

echo
echo "Step 2: Setting up Git repository..."
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
    git commit -m "Initial commit for deployment"
else
    echo "Git repository already exists."
    
    echo "Adding any new files to Git..."
    git add .
    
    echo "Creating deployment commit..."
    git commit -m "Deployment update"
fi

echo
echo "Step 3: Instructions for deploying to Render..."
echo
echo "1. Push your code to GitHub, GitLab, or Bitbucket:"
echo "   - Create a new repository on GitHub/GitLab/Bitbucket"
echo "   - Follow the instructions to push your existing repository"
echo
echo "2. Go to Render.com and sign in"
echo
echo "3. Click \"New\" and select \"Blueprint\""
echo
echo "4. Connect your Git repository"
echo
echo "5. Render will automatically detect the render.yaml file and set up your service"
echo
echo "6. Click \"Apply\" to deploy your application"
echo
echo "7. Once deployed, Render will provide you with a URL to access your application"
echo "   (typically https://virtual-lawyer.onrender.com)"
echo
echo "Note: You'll need to set up environment variables in the Render dashboard:"
echo "- MONGODB_URI: Your MongoDB connection string"
echo "- JWT_SECRET: A secret key for JWT authentication"
echo
read -p "Press Enter to exit..."