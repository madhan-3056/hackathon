#!/bin/bash

echo "===== Pushing Virtual Lawyer to GitHub ====="
echo
echo "This script will guide you through pushing your code to GitHub"
echo
echo "Prerequisites:"
echo "1. A GitHub account"
echo "2. Git installed on your computer"
echo
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo
echo "Step 1: Checking if Git is installed..."
echo

if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git and try again."
    echo "You can download Git from https://git-scm.com/downloads"
    exit 1
fi

echo "Git is installed."

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
    
    echo "Git repository initialized."
else
    echo "Git repository already exists."
fi

echo
echo "Step 3: Setting up GitHub repository..."
echo

read -p "Enter a name for your GitHub repository (e.g., virtual-lawyer): " repo_name
read -p "Enter your GitHub username: " github_username

echo
echo "Step 4: Adding files to Git..."
echo

echo "Adding all files to Git..."
git add .

echo
echo "Step 5: Committing changes..."
echo

read -p "Enter a commit message (e.g., Initial commit): " commit_message
git commit -m "$commit_message"

echo
echo "Step 6: Creating GitHub repository..."
echo

echo "Please create a new repository on GitHub:"
echo
echo "1. Go to https://github.com/new"
echo "2. Enter \"$repo_name\" as the repository name"
echo "3. Choose whether to make it public or private"
echo "4. Do NOT initialize with README, .gitignore, or license"
echo "5. Click \"Create repository\""
echo
read -p "Press Enter when you've created the repository..."

echo
echo "Step 7: Pushing to GitHub..."
echo

echo "Adding GitHub remote..."
git remote add origin https://github.com/$github_username/$repo_name.git

echo "Pushing to GitHub..."
git push -u origin master

if [ $? -ne 0 ]; then
    echo
    echo "Push failed. Trying with 'main' branch instead of 'master'..."
    git push -u origin main
    
    if [ $? -ne 0 ]; then
        echo
        echo "Push failed. You may need to authenticate with GitHub."
        echo
        echo "Options:"
        echo "1. Use GitHub CLI: https://cli.github.com/"
        echo "2. Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
        echo "3. Use GitHub Desktop: https://desktop.github.com/"
        echo
        echo "After authenticating, run:"
        echo "git push -u origin master"
        echo
        exit 1
    fi
fi

echo
echo "Success! Your code has been pushed to GitHub."
echo
echo "Your repository is available at: https://github.com/$github_username/$repo_name"
echo
echo "Next steps:"
echo "1. To deploy to Render: run ./deploy-to-render.sh"
echo "2. To deploy to Heroku: run ./deploy-to-heroku.sh"
echo
read -p "Press Enter to exit..."