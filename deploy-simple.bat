@echo off
echo Starting simple deployment process...
node deploy-simple.js
if %ERRORLEVEL% NEQ 0 (
    echo Deployment failed!
    exit /b 1
) else (
    echo Deployment completed successfully!
    echo You can now start the server with: npm start
    exit /b 0
)