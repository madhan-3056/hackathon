#!/bin/bash
echo "Starting simple deployment process..."
node deploy-simple.js
if [ $? -ne 0 ]; then
    echo "Deployment failed!"
    exit 1
else
    echo "Deployment completed successfully!"
    echo "You can now start the server with: npm start"
    exit 0
fi