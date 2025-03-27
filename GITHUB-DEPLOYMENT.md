# GitHub and Deployment Guide

This guide will walk you through the process of pushing your code to GitHub and deploying your application to a live server.

## Table of Contents

1. [Pushing to GitHub](#pushing-to-github)
2. [Deploying to Render](#deploying-to-render)
3. [Deploying to Heroku](#deploying-to-heroku)
4. [Setting Up GitHub Actions](#setting-up-github-actions)
5. [Continuous Deployment](#continuous-deployment)

## Pushing to GitHub

### Using the Script

The easiest way to push your code to GitHub is to use the provided script:

For Windows:
```
push-to-github.bat
```

For Linux/Mac:
```
./push-to-github.sh
```

The script will:
1. Check if Git is installed
2. Initialize a Git repository (if needed)
3. Create a .gitignore file
4. Guide you through creating a GitHub repository
5. Push your code to GitHub

### Manual Steps

If you prefer to do it manually:

1. **Initialize Git repository**
   ```
   git init
   ```

2. **Create .gitignore file**
   ```
   echo node_modules > .gitignore
   echo .env >> .gitignore
   echo .DS_Store >> .gitignore
   echo npm-debug.log >> .gitignore
   echo /frontend/node_modules >> .gitignore
   ```

3. **Add files to Git**
   ```
   git add .
   ```

4. **Commit changes**
   ```
   git commit -m "Initial commit"
   ```

5. **Create GitHub repository**
   - Go to https://github.com/new
   - Enter a name for your repository
   - Choose whether to make it public or private
   - Do NOT initialize with README, .gitignore, or license
   - Click "Create repository"

6. **Add GitHub remote**
   ```
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```

7. **Push to GitHub**
   ```
   git push -u origin master
   ```
   (or `git push -u origin main` if your default branch is main)

## Deploying to Render

### Using the Script

To deploy to Render.com:

For Windows:
```
deploy-to-render.bat
```

For Linux/Mac:
```
./deploy-to-render.sh
```

The script will:
1. Guide you through preparing your application for deployment
2. Help you set up a Git repository
3. Provide instructions for deploying to Render

### Manual Steps

1. **Push your code to GitHub** (see above)

2. **Sign up for Render**
   - Go to https://render.com
   - Sign up for an account

3. **Create a new Web Service**
   - Click "New" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the render.yaml file
   - Click "Apply" to deploy your application

4. **Set up environment variables**
   - In the Render dashboard, go to your service
   - Click on "Environment"
   - Add the following environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secret key for JWT authentication

5. **Access your application**
   - Once deployed, Render will provide you with a URL to access your application
   - Typically: https://virtual-lawyer.onrender.com

## Deploying to Heroku

### Using the Script

To deploy to Heroku:

For Windows:
```
deploy-to-heroku.bat
```

For Linux/Mac:
```
./deploy-to-heroku.sh
```

The script will:
1. Check if Heroku CLI is installed
2. Create a Heroku application
3. Set up environment variables
4. Deploy your code to Heroku

### Manual Steps

1. **Install Heroku CLI**
   - Go to https://devcenter.heroku.com/articles/heroku-cli
   - Download and install the Heroku CLI

2. **Login to Heroku**
   ```
   heroku login
   ```

3. **Create Heroku application**
   ```
   heroku create your-app-name
   ```

4. **Set up environment variables**
   ```
   heroku config:set NODE_ENV=production --app your-app-name
   heroku config:set MONGODB_URI=your-mongodb-uri --app your-app-name
   heroku config:set JWT_SECRET=your-jwt-secret --app your-app-name
   heroku config:set JWT_EXPIRE=30d --app your-app-name
   heroku config:set JWT_COOKIE_EXPIRE=30 --app your-app-name
   ```

5. **Push to Heroku**
   ```
   git push heroku master
   ```
   (or `git push heroku main` if your default branch is main)

6. **Access your application**
   - Your application will be available at: https://your-app-name.herokuapp.com

## Setting Up GitHub Actions

GitHub Actions allows you to automate your deployment process. A workflow file has been created at `.github/workflows/deploy.yml`.

To use it:

1. **Push your code to GitHub** (see above)

2. **Set up secrets in GitHub**
   - Go to your GitHub repository
   - Click on "Settings"
   - Click on "Secrets and variables" > "Actions"
   - Add the following secrets:
     - For Render:
       - `RENDER_DEPLOY_HOOK_URL`: Your Render deploy hook URL
     - For Heroku:
       - `HEROKU_API_KEY`: Your Heroku API key
       - `HEROKU_APP_NAME`: Your Heroku app name
       - `HEROKU_EMAIL`: Your Heroku email

3. **Uncomment the deployment section**
   - Edit the `.github/workflows/deploy.yml` file
   - Uncomment the deployment section for your chosen platform (Render or Heroku)
   - Commit and push the changes

4. **Trigger the workflow**
   - Push a commit to your main/master branch
   - GitHub Actions will automatically build and deploy your application

## Continuous Deployment

With GitHub Actions set up, you can now enjoy continuous deployment:

1. **Make changes to your code**
   - Edit your files
   - Commit the changes
   - Push to GitHub

2. **Automatic deployment**
   - GitHub Actions will automatically build and deploy your application
   - No need to manually deploy anymore

3. **Monitor deployments**
   - Go to your GitHub repository
   - Click on "Actions"
   - You can see the status of your deployments

## Getting Your Application URL

After deployment, you'll get a URL to access your application:

- **Render.com**: https://virtual-lawyer.onrender.com (or similar)
- **Heroku**: https://your-app-name.herokuapp.com

This URL will serve both your frontend and backend from the same origin, eliminating CORS issues and providing a seamless experience for your users.

## Troubleshooting

### GitHub Push Issues

- **Authentication failed**: You may need to set up authentication with GitHub
  - Use GitHub CLI: https://cli.github.com/
  - Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
  - Use GitHub Desktop: https://desktop.github.com/

- **Branch name issues**: If pushing to `master` fails, try `main` instead
  ```
  git push -u origin main
  ```

### Deployment Issues

- **Render deployment fails**: Check the logs in the Render dashboard
  - Make sure your MongoDB URI is correct
  - Make sure your JWT secret is set

- **Heroku deployment fails**: Check the logs with `heroku logs --tail`
  - Make sure your MongoDB URI is correct
  - Make sure your JWT secret is set
  - Make sure your Procfile is correct

- **GitHub Actions fails**: Check the workflow logs in GitHub
  - Make sure your secrets are set correctly
  - Make sure the workflow file is correctly formatted