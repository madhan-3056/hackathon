# Virtual Lawyer Deployment Guide

This guide provides instructions for deploying the Virtual Lawyer application using different methods.

## Prerequisites

Before deploying, make sure you have:

1. A copy of the Virtual Lawyer codebase
2. A Claude API key
3. MongoDB (local or cloud-based)
4. Node.js and npm installed on your local machine

## Deployment Options

Choose one of the following deployment methods:

### Option 1: Deploy to a VPS (Virtual Private Server)

This is the recommended method for most users as it provides a good balance of control and simplicity.

#### Requirements:
- A VPS (e.g., DigitalOcean, Linode, AWS EC2)
- SSH access to the VPS
- A domain name (optional)

#### Steps:

1. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh your-server-ip your-username
   ```

3. Follow the prompts to complete the deployment.

4. (Optional) Set up SSL with Let's Encrypt:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 2: Deploy with Docker

This method uses Docker and Docker Compose to containerize your application.

#### Requirements:
- A VPS with Docker and Docker Compose installed
- SSH access to the VPS
- A domain name (optional)

#### Steps:

1. Make the Docker deployment script executable:
   ```bash
   chmod +x deploy-docker.sh
   ```

2. Run the Docker deployment script:
   ```bash
   ./deploy-docker.sh your-server-ip your-username
   ```

3. Follow the prompts to complete the deployment.

4. (Optional) Set up SSL with Let's Encrypt:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 3: Deploy to Heroku

This method deploys your application to Heroku, a platform-as-a-service provider.

#### Requirements:
- Heroku CLI installed
- A Heroku account
- Git installed

#### Steps:

1. Make the Heroku deployment script executable:
   ```bash
   chmod +x deploy-heroku.sh
   ```

2. Run the Heroku deployment script:
   ```bash
   ./deploy-heroku.sh your-app-name
   ```

3. Follow the prompts to complete the deployment.

## Post-Deployment Tasks

After deploying your application, you should:

1. **Test the application**: Make sure all features are working correctly.
2. **Set up monitoring**: Consider using a service like New Relic or Datadog.
3. **Set up backups**: Configure regular backups of your MongoDB database.
4. **Set up a custom domain**: If you have a domain name, configure it to point to your application.
5. **Set up SSL**: If you haven't already, set up SSL to secure your application.

## Troubleshooting

If you encounter issues during deployment:

1. **Check the logs**: Look at the application logs for error messages.
2. **Check the server requirements**: Make sure your server meets the minimum requirements.
3. **Check the environment variables**: Make sure all required environment variables are set correctly.
4. **Check the database connection**: Make sure your application can connect to the MongoDB database.

## Updating Your Application

To update your application after making changes:

1. **VPS deployment**: Run the deployment script again.
2. **Docker deployment**: Run the Docker deployment script again.
3. **Heroku deployment**: Run the Heroku deployment script again or push your changes to Heroku.

## Support

If you need help with deployment, please open an issue on the GitHub repository or contact the development team.