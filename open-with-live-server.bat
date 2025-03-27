@echo off
echo ===== Opening with Live Server =====
echo.
echo This script will:
echo 1. Build the frontend (if needed)
echo 2. Open VS Code
echo 3. Start Live Server
echo.
echo Note: This will only serve the frontend. API calls will not work.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Step 1: Checking frontend build...
echo.

if not exist "frontend\build" (
    echo Frontend build not found. Building now...
    cd frontend
    call npm install
    call npm run build
    cd ..
) else (
    echo Frontend build found.
)

echo.
echo Step 2: Opening VS Code...
echo.
code virtual-lawyer.code-workspace

echo.
echo Step 3: Instructions to start Live Server...
echo.
echo In VS Code:
echo 1. Install the Live Server extension if not already installed
echo 2. Right-click on frontend/build/index.html
echo 3. Select "Open with Live Server"
echo.
echo Your application will open in the browser automatically.
echo.
echo Press any key to exit...
pause > nul