# Fixing 'react-scripts' Not Recognized Error

If you're encountering the error "'react-scripts' is not recognized as an internal or external command, operable program or batch file" when trying to start the frontend, this guide will help you fix it.

## Quick Fix

Run one of the following scripts:

1. **Fix and Start Application**:
   ```
   quick-fix-and-start.bat
   ```
   This will fix the react-scripts issue and start the application.

2. **Fix Only**:
   ```
   fix-react-scripts.bat
   ```
   This will only fix the react-scripts issue without starting the application.

3. **Fix Frontend**:
   ```
   fix-frontend.bat
   ```
   This will install all frontend dependencies, including react-scripts.

## Manual Fix

If the scripts don't work, you can fix the issue manually:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install react-scripts:
   ```bash
   npm install react-scripts --save
   ```

3. Verify the installation:
   ```bash
   npx react-scripts --version
   ```

4. Return to the root directory:
   ```bash
   cd ..
   ```

## Starting the Application After Fix

After fixing the issue, you can start the application using:

1. **Start Menu**:
   ```
   start.bat
   ```
   This will show a menu with options to start the application.

2. **Start Application**:
   ```
   start-app.bat
   ```
   This will start both the frontend and backend.

3. **Start Frontend Only**:
   ```
   start-frontend.bat
   ```
   This will start only the frontend.

4. **Start Backend Only**:
   ```
   start-backend.bat
   ```
   This will start only the backend.

## Accessing the Application

Once the application is running, you can access it at:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **API Documentation**: http://localhost:5001/api-docs

You can also use the provided script to open the application in your browser:
```
access-app.bat
```

## Troubleshooting

If you're still having issues:

1. **Check Node.js Version**:
   Make sure you have Node.js v14 or higher installed.
   ```bash
   node --version
   ```

2. **Check npm Version**:
   Make sure you have npm v6 or higher installed.
   ```bash
   npm --version
   ```

3. **Clear npm Cache**:
   ```bash
   npm cache clean --force
   ```

4. **Reinstall All Dependencies**:
   ```bash
   install.bat
   ```
   Or manually:
   ```bash
   npm install
   cd frontend
   npm install
   npm install react-scripts --save
   cd ..
   ```

5. **Check for Port Conflicts**:
   Make sure ports 3000 and 5001 are not in use by other applications.
   ```bash
   netstat -ano | findstr :3000
   netstat -ano | findstr :5001
   ```

## Need More Help?

If you're still having issues, please refer to the main [README.md](README.md) file or contact the development team.