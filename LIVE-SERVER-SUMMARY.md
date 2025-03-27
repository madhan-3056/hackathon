# Live Server Connection Summary

We've prepared your Virtual Lawyer application for deployment to a live production server. Here's a summary of the files and scripts we've created:

## Deployment Scripts

1. **deploy-live.sh**
   - Main script for deploying to a live production server
   - Sets up the server with all necessary components
   - Configures Nginx, SSL, firewall, and monitoring
   - Usage: `./deploy-live.sh your-server-ip your-username your-ssh-port your-domain.com`

2. **deploy-live.bat**
   - Windows version of the deployment script
   - Uses WSL (Windows Subsystem for Linux) if available
   - Usage: `deploy-live.bat`

3. **connect-to-server.sh**
   - Script for connecting to your live server
   - Provides a menu of common server management tasks
   - Usage: `./connect-to-server.sh your-server-ip your-username your-ssh-port`

4. **connect-to-server.bat**
   - Windows version of the server connection script
   - Uses WSL (Windows Subsystem for Linux) if available
   - Usage: `connect-to-server.bat`

## Documentation

1. **LIVE-SERVER-GUIDE.md**
   - Comprehensive guide for deploying to a live production server
   - Includes manual deployment instructions
   - Covers security considerations and post-deployment tasks

## npm Scripts

We've added the following npm scripts to package.json:

1. **deploy:live**
   - Deploys to a live production server
   - Usage: `npm run deploy:live`

2. **server:connect**
   - Connects to your live server
   - Usage: `npm run server:connect`

3. **prepare:deploy**
   - Makes all deployment scripts executable
   - Usage: `npm run prepare:deploy`

## How to Deploy to a Live Server

### Option 1: Using the Deployment Script (Recommended)

1. Make the deployment script executable:
   ```bash
   chmod +x deploy-live.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy-live.sh your-server-ip your-username your-ssh-port your-domain.com
   ```

3. Follow the prompts to complete the deployment.

### Option 2: Using npm Scripts

1. Make all deployment scripts executable:
   ```bash
   npm run prepare:deploy
   ```

2. Deploy to a live server:
   ```bash
   npm run deploy:live
   ```

3. Follow the prompts to enter your server details.

### Option 3: For Windows Users

1. Run the Windows deployment script:
   ```
   deploy-live.bat
   ```

2. Follow the prompts to enter your server details.

## How to Connect to Your Live Server

### Option 1: Using the Connection Script

1. Make the connection script executable:
   ```bash
   chmod +x connect-to-server.sh
   ```

2. Run the connection script:
   ```bash
   ./connect-to-server.sh your-server-ip your-username your-ssh-port
   ```

3. Choose an action from the menu.

### Option 2: Using npm Scripts

1. Connect to your live server:
   ```bash
   npm run server:connect
   ```

2. Follow the prompts to enter your server details and choose an action.

### Option 3: For Windows Users

1. Run the Windows connection script:
   ```
   connect-to-server.bat
   ```

2. Follow the prompts to enter your server details and choose an action.

## Next Steps

1. Choose a deployment method that best suits your needs
2. Deploy your application to a live server
3. Test your deployed application
4. Set up regular backups
5. Monitor your application

For detailed instructions, refer to the `LIVE-SERVER-GUIDE.md` file.