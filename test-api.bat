@echo off
echo ===== Testing API Endpoints =====
echo.
echo This script will test the API endpoints of your application.
echo Make sure your server is running before executing this script.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Testing API endpoints...
echo.

echo Trying to run with ESM (test-api.js)...
node test-api.js

if %errorlevel% neq 0 (
    echo.
    echo ESM version failed. Trying CommonJS version (test-api.cjs)...
    echo.
    node test-api.cjs
)

echo.
echo Press any key to exit...
pause > nul