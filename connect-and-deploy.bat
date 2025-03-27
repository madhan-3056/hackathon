@echo off
echo ===== Virtual Lawyer Connect and Deploy =====
echo.
echo This script will connect the frontend and backend and deploy to a live server.

echo.
echo Step 1: Building the application for deployment...
call build-for-deployment.bat

echo.
echo Step 2: Testing the connection between frontend and backend...
call test-connection.bat

echo.
echo Step 3: Deploying to a live server...
call deploy-live.bat

echo.
echo ===== Connect and Deploy Complete =====
echo.
pause