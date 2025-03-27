#!/bin/bash

# Make deployment scripts executable
chmod +x deploy.sh
chmod +x deploy-docker.sh
chmod +x deploy-heroku.sh
chmod +x deploy-live.sh
chmod +x install.sh
chmod +x start.sh
chmod +x update-env.sh
chmod +x fix-frontend.sh
chmod +x connect-to-server.sh
chmod +x build-for-deployment.sh
chmod +x connect-and-deploy.sh

echo "===== Virtual Lawyer Deployment Preparation ====="
echo "All deployment scripts are now executable."
echo ""
echo "Deployment options:"
echo "1. To deploy to a VPS, run: ./deploy.sh your-server-ip your-username"
echo "2. To deploy with Docker, run: ./deploy-docker.sh your-server-ip your-username"
echo "3. To deploy to Heroku, run: ./deploy-heroku.sh your-app-name"
echo "4. To deploy to a live production server, run: ./deploy-live.sh your-server-ip your-username your-ssh-port your-domain.com"
echo ""
echo "Check deployment readiness:"
echo "  node check-deployment.js"
echo ""
echo "For detailed deployment instructions, see:"
echo "- DEPLOYMENT.md - General deployment guide"
echo "- LIVE-SERVER-GUIDE.md - Live server deployment guide"
echo "- WINDOWS-DEPLOYMENT.md - Windows deployment guide"