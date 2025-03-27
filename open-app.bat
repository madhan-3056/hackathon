@echo off
echo ===== Opening Virtual Lawyer Application =====
echo.
echo Choose which part of the application to open:
echo 1. Frontend (http://localhost:3000)
echo 2. Backend (http://localhost:5001)
echo 3. API Documentation (http://localhost:5001/api-docs)
echo 4. All of the above
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo Opening frontend...
    start "" http://localhost:3000
) else if "%choice%"=="2" (
    echo Opening backend...
    start "" http://localhost:5001
) else if "%choice%"=="3" (
    echo Opening API documentation...
    start "" http://localhost:5001/api-docs
) else if "%choice%"=="4" (
    echo Opening all...
    start "" http://localhost:3000
    start "" http://localhost:5001
    start "" http://localhost:5001/api-docs
) else if "%choice%"=="5" (
    echo Exiting...
    exit /b 0
) else (
    echo Invalid choice. Please try again.
    pause
    call open-app.bat
)

echo.
echo Application opened in your default browser.
echo.
pause