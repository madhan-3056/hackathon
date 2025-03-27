# Deployment Guide for Virtual Lawyer

This guide provides step-by-step instructions for deploying your Virtual Lawyer application to various hosting platforms.

## Table of Contents

1. [Deployment to Render](#deployment-to-render)
2. [Deployment to Heroku](#deployment-to-heroku)
3. [Deployment to Netlify](#deployment-to-netlify)
4. [Deployment to Vercel](#deployment-to-vercel)
5. [Deployment to AWS](#deployment-to-aws)
6. [Deployment to DigitalOcean](#deployment-to-digitalocean)
7. [Deployment to a VPS](#deployment-to-a-vps)
8. [Database Setup](#database-setup)
9. [Environment Variables](#environment-variables)
10. [Troubleshooting](#troubleshooting)

## Deployment to Render

Render is a unified platform to build and run all your apps and websites with free SSL, a global CDN, private networks, and auto-deploys from Git.

### Prerequisites

- A Render account (https://render.com)
- Git installed on your computer
- A GitHub, GitLab, or Bitbucket account

### Steps

1. **Prepare your application**
   - Run the deployment script:
     ```
     deploy-to-render.bat
     ```
     or
     ```
     ./deploy-to-render.sh
     ```

2. **Push your code to GitHub/GitLab/Bitbucket**
   - Create a new repository
   - Push your code to the repository

3. **Deploy on Render**
   - Go to Render.com and sign in
   - Click "New" and select "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the render.yaml file and set up your service
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

## Deployment to Heroku

Heroku is a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.

### Prerequisites

- A Heroku account (https://heroku.com)
- Heroku CLI installed on your computer
- Git installed on your computer

### Steps

1. **Prepare your application**
   - Run the deployment script:
     ```
     deploy-to-heroku.bat
     ```
     or
     ```
     ./deploy-to-heroku.sh
     ```

2. **Follow the script prompts**
   - Enter a name for your Heroku application
   - Enter your MongoDB URI
   - Enter a JWT secret key (or let the script generate one)

3. **Access your application**
   - Once deployed, your application will be available at:
   - https://your-app-name.herokuapp.com

## Deployment to Netlify

Netlify is a web developer platform that multiplies productivity. By unifying the elements of the modern decoupled web, from local development to advanced edge logic, Netlify enables a 10x faster path to much more performant, secure, and scalable websites and apps.

### Steps for Frontend-Only Deployment

1. **Build your frontend**
   ```
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Create a Netlify account at https://netlify.com
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Run: `netlify deploy`
   - Follow the prompts and select the `frontend/build` directory
   - For production deployment: `netlify deploy --prod`

3. **Set up API proxy**
   - Create a `netlify.toml` file in your project root:
     ```toml
     [[redirects]]
       from = "/api/*"
       to = "https://your-backend-url.com/api/:splat"
       status = 200
       force = true
     ```
   - Replace `https://your-backend-url.com` with your backend URL

## Deployment to a VPS

### Prerequisites

- A VPS (Virtual Private Server) from providers like DigitalOcean, Linode, AWS EC2, etc.
- SSH access to your server
- Basic knowledge of Linux commands

### Steps

1. **Connect to your server**
   ```
   ssh username@your-server-ip
   ```

2. **Install Node.js and npm**
   ```
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install MongoDB**
   ```
   sudo apt-get install -y mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

4. **Clone your repository**
   ```
   git clone https://github.com/yourusername/virtual-lawyer.git
   cd virtual-lawyer
   ```

5. **Install dependencies and build**
   ```
   npm install
   cd frontend
   npm install
   npm run build
   cd ..
   ```

6. **Set up environment variables**
   ```
   nano .env
   ```
   Add the following:
   ```
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/virtual_lawyer
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

7. **Install PM2 to keep your app running**
   ```
   sudo npm install -g pm2
   pm2 start server-enhanced.js
   pm2 startup
   pm2 save
   ```

8. **Set up Nginx as a reverse proxy**
   ```
   sudo apt-get install -y nginx
   sudo nano /etc/nginx/sites-available/virtual-lawyer
   ```
   Add the following:
   ```
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable the site and restart Nginx**
   ```
   sudo ln -s /etc/nginx/sites-available/virtual-lawyer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Set up SSL with Let's Encrypt**
    ```
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ```

11. **Access your application**
    - Your application will be available at https://your-domain.com

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create a MongoDB Atlas account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a cluster**
   - Click "Build a Cluster"
   - Choose the free tier
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Set up database access**
   - Go to "Database Access" under Security
   - Click "Add New Database User"
   - Create a username and password
   - Set privileges to "Read and Write to Any Database"
   - Click "Add User"

4. **Set up network access**
   - Go to "Network Access" under Security
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get your connection string**
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with your database name (e.g., `virtual_lawyer`)

6. **Use the connection string in your application**
   - Set it as the `MONGODB_URI` environment variable in your deployment platform

## Environment Variables

Your application requires the following environment variables:

- `NODE_ENV`: Set to `production` for deployment
- `PORT`: The port your application will run on (often set by the hosting platform)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secret key for JWT authentication
- `JWT_EXPIRE`: JWT token expiration time (e.g., `30d` for 30 days)
- `JWT_COOKIE_EXPIRE`: JWT cookie expiration time in days (e.g., `30`)

## Troubleshooting

### Application crashes after deployment

1. **Check the logs**
   - Render: Go to your service and click on "Logs"
   - Heroku: Run `heroku logs --tail`
   - VPS: Check PM2 logs with `pm2 logs`

2. **Common issues**
   - **MongoDB connection error**: Check your MongoDB URI and make sure your IP is whitelisted
   - **Port already in use**: The hosting platform might be using a different port. Use `process.env.PORT || 5001`
   - **Missing environment variables**: Make sure all required environment variables are set
   - **Build errors**: Check if the frontend build was successful

### Frontend loads but API calls fail

1. **Check CORS settings**
   - Make sure your backend allows requests from your frontend domain
   - In `server-enhanced.js`, check the CORS configuration

2. **Check API endpoints**
   - Make sure your frontend is using the correct API URLs
   - For relative URLs, make sure they start with `/api/v1/`

3. **Check network requests**
   - Open your browser's developer tools
   - Go to the Network tab
   - Look for failed requests and check the error messages

### Database connection issues

1. **Check your MongoDB URI**
   - Make sure the username and password are correct
   - Make sure the database name is correct
   - Make sure your IP is whitelisted in MongoDB Atlas

2. **Check MongoDB service**
   - If using a local MongoDB, make sure the service is running
   - Run `sudo systemctl status mongodb` on Linux
   - Run `brew services list` on macOS

### SSL/HTTPS issues

1. **Certificate errors**
   - Make sure your SSL certificate is valid
   - For Let's Encrypt, run `sudo certbot renew`

2. **Mixed content warnings**
   - Make sure all resources (images, scripts, etc.) are loaded over HTTPS
   - Update hardcoded HTTP URLs to HTTPS or use protocol-relative URLs (`//example.com/resource`)

## Getting Help

If you encounter any issues not covered in this guide, please:

1. Check the documentation of your hosting platform
2. Search for the error message online
3. Ask for help on Stack Overflow or other developer forums
4. Contact your hosting platform's support team