@echo off
echo ===== Virtual Lawyer Development Environment =====
echo.

:menu
echo Choose an option:
echo 1. Start application (standard)
echo 2. Start application with auto-reload (nodemon)
echo 3. Start application with debugging enabled
echo 4. Build frontend
echo 5. Run database check
echo 6. Test API endpoints
echo 7. Open application in browser
echo 8. Exit
echo.

set /p option="Enter option (1-8): "

if "%option%"=="1" goto start_standard
if "%option%"=="2" goto start_nodemon
if "%option%"=="3" goto start_debug
if "%option%"=="4" goto build_frontend
if "%option%"=="5" goto check_db
if "%option%"=="6" goto test_api
if "%option%"=="7" goto open_browser
if "%option%"=="8" goto end

echo Invalid option. Please try again.
goto menu

:start_standard
echo.
echo Starting application in standard mode...
echo.
echo Your application will be available at: http://localhost:5001
echo Press Ctrl+C to stop the server
echo.
node server-enhanced.js
goto end

:start_nodemon
echo.
echo Checking if nodemon is installed...
call nodemon --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Nodemon is not installed. Installing now...
    call npm install -g nodemon
)

echo.
echo Starting application with auto-reload (nodemon)...
echo.
echo Your application will be available at: http://localhost:5001
echo The server will automatically reload when you make changes
echo Press Ctrl+C to stop the server
echo.
nodemon server-enhanced.js
goto end

:start_debug
echo.
echo Starting application with debugging enabled...
echo.
echo Your application will be available at: http://localhost:5001
echo Debugger is listening on port 9229
echo To connect, open Chrome and go to chrome://inspect
echo Press Ctrl+C to stop the server
echo.
node --inspect server-enhanced.js
goto end

:build_frontend
echo.
echo Building frontend...
echo.
cd frontend
call npm install
call npm run build
cd ..
echo.
echo Frontend build complete.
echo.
pause
goto menu

:check_db
echo.
echo Checking database connection...
echo.
node -e "const mongoose = require('mongoose'); require('dotenv').config(); const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual_lawyer'; mongoose.connect(uri).then(() => { console.log('Connected to MongoDB successfully!'); mongoose.connection.close(); }).catch(err => { console.error('Failed to connect to MongoDB:', err.message); });"
echo.
pause
goto menu

:test_api
echo.
echo Testing API endpoints...
echo.

echo Creating test script...
echo const axios = require('axios'); > test-api.js
echo. >> test-api.js
echo async function testEndpoints() { >> test-api.js
echo   try { >> test-api.js
echo     console.log('Testing API endpoints...'); >> test-api.js
echo     console.log('-------------------------'); >> test-api.js
echo. >> test-api.js
echo     // Test health endpoint >> test-api.js
echo     console.log('Testing health endpoint...'); >> test-api.js
echo     const health = await axios.get('http://localhost:5001/api/v1/health'); >> test-api.js
echo     console.log('Health check:', health.data); >> test-api.js
echo     console.log('-------------------------'); >> test-api.js
echo. >> test-api.js
echo     // Test status endpoint >> test-api.js
echo     console.log('Testing status endpoint...'); >> test-api.js
echo     const status = await axios.get('http://localhost:5001/status'); >> test-api.js
echo     console.log('Status check:', status.data.status); >> test-api.js
echo     console.log('Server uptime:', Math.floor(status.data.uptime / 60), 'minutes'); >> test-api.js
echo     console.log('-------------------------'); >> test-api.js
echo. >> test-api.js
echo     console.log('All tests completed successfully!'); >> test-api.js
echo   } catch (error) { >> test-api.js
echo     console.error('API test failed:'); >> test-api.js
echo     if (error.response) { >> test-api.js
echo       console.error('Status:', error.response.status); >> test-api.js
echo       console.error('Data:', error.response.data); >> test-api.js
echo     } else if (error.request) { >> test-api.js
echo       console.error('No response received. Is the server running?'); >> test-api.js
echo     } else { >> test-api.js
echo       console.error('Error:', error.message); >> test-api.js
echo     } >> test-api.js
echo   } >> test-api.js
echo } >> test-api.js
echo. >> test-api.js
echo testEndpoints(); >> test-api.js

echo Running test script...
node test-api.js
echo.
pause
goto menu

:open_browser
echo.
echo Opening application in browser...
start http://localhost:5001
goto menu

:end
echo.
echo Exiting...
exit /b 0