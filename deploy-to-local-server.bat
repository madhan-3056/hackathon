@echo off
echo ===== Deploying Virtual Lawyer to Local Server =====
echo.

set /p server_path="Enter the path to your local server directory (e.g., C:\xampp\htdocs\virtual-lawyer): "

if not exist "%server_path%" (
    echo Creating directory %server_path%...
    mkdir "%server_path%"
)

echo.
echo Step 1: Building the application...
echo.

echo Building frontend...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo Step 2: Copying files to local server...
echo.

echo Creating necessary directories...
mkdir "%server_path%\public"
mkdir "%server_path%\config"
mkdir "%server_path%\controllers"
mkdir "%server_path%\middlewares"
mkdir "%server_path%\models"
mkdir "%server_path%\routes"
mkdir "%server_path%\services"
mkdir "%server_path%\utils"

echo Copying frontend files...
xcopy /E /Y "frontend\build\*" "%server_path%\public\"

echo Copying server files...
copy "server-enhanced.js" "%server_path%\"
copy "package.json" "%server_path%\"
copy ".env" "%server_path%\"

echo Copying application directories...
xcopy /E /Y "config\*" "%server_path%\config\"
xcopy /E /Y "controllers\*" "%server_path%\controllers\"
xcopy /E /Y "middlewares\*" "%server_path%\middlewares\"
xcopy /E /Y "models\*" "%server_path%\models\"
xcopy /E /Y "routes\*" "%server_path%\routes\"
xcopy /E /Y "services\*" "%server_path%\services\"
xcopy /E /Y "utils\*" "%server_path%\utils\"

echo.
echo Step 3: Setting up the server...
echo.

echo Creating start script...
(
echo @echo off
echo echo Starting Virtual Lawyer application...
echo cd /d "%%~dp0"
echo npm install
echo node server-enhanced.js
) > "%server_path%\start-server.bat"

echo.
echo Deployment complete!
echo.
echo To start the application:
echo 1. Navigate to %server_path%
echo 2. Run start-server.bat
echo 3. Access the application at http://localhost:5001
echo.
echo Press any key to exit...
pause > nul