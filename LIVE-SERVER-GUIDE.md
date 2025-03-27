# Live Server Deployment Guide

This guide provides detailed instructions for deploying the Virtual Lawyer application to a live production server.

## Prerequisites

Before deploying to a live server, you need:

1. A VPS or dedicated server with:
   - Ubuntu 20.04 LTS or newer
   - At least 2GB RAM
   - At least 20GB storage
   - Root or sudo access

2. A domain name pointing to your server's IP address

3. SSH access to your server

## Deployment Options

### Option 1: Automated Deployment (Recommended)

This method uses the provided deployment script to automate the entire process.

#### For Linux/Mac Users:

1. Make the deployment script executable:
   ```bash
   chmod +x deploy-live.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy-live.sh your-server-ip your-username your-ssh-port your-domain.com
   ```

3. Follow the prompts to complete the deployment.

#### For Windows Users:

1. Run the Windows deployment script:
   ```
   deploy-live.bat
   ```

2. Follow the prompts to enter your server details.

### Option 2: Manual Deployment

If you prefer to deploy manually or if the automated script doesn't work for your setup, follow these steps:

1. **Connect to your server**:
   ```bash
   ssh your-username@your-server-ip -p your-ssh-port
   ```

2. **Update system packages**:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

3. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

4. **Install MongoDB**:
   ```bash
   sudo apt install -y mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

5. **Install PM2**:
   ```bash
   sudo npm install -g pm2
   ```

6. **Create application directory**:
   ```bash
   mkdir -p ~/virtual-lawyer
   ```

7. **Copy application files** (from your local machine):
   ```bash
   rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' ./ your-username@your-server-ip:~/virtual-lawyer/
   ```

8. **Copy environment file** (from your local machine):
   ```bash
   scp .env.claude your-username@your-server-ip:~/virtual-lawyer/.env
   ```

9. **Install dependencies**:
   ```bash
   cd ~/virtual-lawyer
   npm install
   ```

10. **Start application with PM2**:
    ```bash
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    ```

11. **Install and configure Nginx**:
    ```bash
    sudo apt install -y nginx
    ```

    Create Nginx configuration:
    ```bash
    sudo nano /etc/nginx/sites-available/virtual-lawyer
    ```

    Add the following configuration:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        location / {
            proxy_pass http://localhost:5001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

    Enable the site:
    ```bash
    sudo ln -sf /etc/nginx/sites-available/virtual-lawyer /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
    ```

12. **Install SSL certificate**:
    ```bash
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ```

13. **Configure firewall**:
    ```bash
    sudo apt install -y ufw
    sudo ufw allow ssh
    sudo ufw allow http
    sudo ufw allow https
    sudo ufw --force enable
    ```

14. **Setup monitoring**:
    ```bash
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 7
    ```

15. **Setup automatic updates**:
    ```bash
    sudo apt install -y unattended-upgrades apt-listchanges
    sudo nano /etc/apt/apt.conf.d/20auto-upgrades
    ```

    Add the following:
    ```
    APT::Periodic::Update-Package-Lists "1";
    APT::Periodic::Unattended-Upgrade "1";
    APT::Periodic::AutocleanInterval "7";
    ```

## Post-Deployment Tasks

After deploying your application, you should:

1. **Test your application**:
   - Visit your domain in a web browser
   - Test all features to ensure they work correctly

2. **Monitor your application**:
   ```bash
   pm2 monit
   ```

3. **Check logs**:
   ```bash
   pm2 logs
   ```

4. **Set up database backups**:
   ```bash
   # Install mongodump
   sudo apt install -y mongodb-clients
   
   # Create backup script
   cat > ~/backup-mongodb.sh << 'EOF'
   #!/bin/bash
   BACKUP_DIR=~/mongodb-backups
   mkdir -p $BACKUP_DIR
   TIMESTAMP=$(date +%Y%m%d_%H%M%S)
   mongodump --out $BACKUP_DIR/$TIMESTAMP
   find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
   EOF
   
   # Make script executable
   chmod +x ~/backup-mongodb.sh
   
   # Add to crontab
   (crontab -l 2>/dev/null; echo "0 2 * * * ~/backup-mongodb.sh") | crontab -
   ```

5. **Set up log rotation** (already done by PM2 logrotate)

6. **Set up monitoring alerts** (optional):
   ```bash
   pm2 install pm2-server-monit
   ```

## Updating Your Application

To update your application after making changes:

1. Run the deployment script again:
   ```bash
   ./deploy-live.sh your-server-ip your-username your-ssh-port your-domain.com
   ```

2. Or manually update:
   ```bash
   # From your local machine
   rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' ./ your-username@your-server-ip:~/virtual-lawyer/
   
   # On your server
   cd ~/virtual-lawyer
   npm install
   pm2 restart all
   ```

## Troubleshooting

If you encounter issues during or after deployment:

1. **Check application logs**:
   ```bash
   pm2 logs
   ```

2. **Check Nginx logs**:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Check MongoDB logs**:
   ```bash
   sudo tail -f /var/log/mongodb/mongodb.log
   ```

4. **Check if services are running**:
   ```bash
   pm2 status
   sudo systemctl status nginx
   sudo systemctl status mongodb
   ```

5. **Check firewall status**:
   ```bash
   sudo ufw status
   ```

6. **Check SSL certificate**:
   ```bash
   sudo certbot certificates
   ```

## Security Considerations

For a production server, consider these additional security measures:

1. **Disable password authentication** and use SSH keys only:
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
   
   Set:
   ```
   PasswordAuthentication no
   ```
   
   Restart SSH:
   ```bash
   sudo systemctl restart sshd
   ```

2. **Change SSH port** to a non-standard port:
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
   
   Change:
   ```
   Port 22
   ```
   
   To a different port (e.g., 2222), then update firewall:
   ```bash
   sudo ufw delete allow ssh
   sudo ufw allow 2222/tcp
   sudo systemctl restart sshd
   ```

3. **Install fail2ban** to protect against brute force attacks:
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

4. **Regular security updates** (already set up with unattended-upgrades)

5. **Database security**:
   ```bash
   # Create MongoDB admin user
   mongo admin --eval 'db.createUser({user: "admin", pwd: "your-secure-password", roles: ["root"]})'
   
   # Enable MongoDB authentication
   sudo nano /etc/mongodb.conf
   ```
   
   Add:
   ```
   auth = true
   ```
   
   Restart MongoDB:
   ```bash
   sudo systemctl restart mongodb
   ```

## Need More Help?

If you need more help with live server deployment, please contact the development team or refer to the documentation for the specific tools used (Nginx, PM2, MongoDB, etc.).