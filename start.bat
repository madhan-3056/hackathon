@echo off
echo ===== Virtual Lawyer Startup Menu =====
echo.
echo Choose an option:
echo 1. Fix frontend issues and start application
echo 2. Start application (if already fixed)
echo 3. Start frontend only
echo 4. Start backend only
echo 5. Install all dependencies
echo 6. View startup guide
echo 7. Exit
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    call fix-and-start.bat
) else if "%choice%"=="2" (
    call start-app.bat
) else if "%choice%"=="3" (
    call start-frontend.bat
) else if "%choice%"=="4" (
    call start-backend.bat
) else if "%choice%"=="5" (
    echo.
    echo Installing all dependencies...
    call npm run install:all
    echo.
    echo All dependencies installed successfully!
    echo.
    pause
    call start.bat
) else if "%choice%"=="6" (
    echo.
    echo Opening startup guide...
    start "" START-APP-GUIDE.md
    echo.
    pause
    call start.bat
) else if "%choice%"=="7" (
    echo.
    echo Exiting...
    exit /b 0
) else (
    echo.
    echo Invalid choice. Please try again.
    echo.
    pause
    call start.bat
)