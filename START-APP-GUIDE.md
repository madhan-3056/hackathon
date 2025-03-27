# Virtual Lawyer Application Startup Guide

This guide provides instructions for starting the Virtual Lawyer application on your local machine.

## Quick Start

For Windows users, we've created batch files to make starting the application easy:

1. **Fix Frontend Issues and Start Application**:
   ```
   fix-and-start.bat
   ```
   This script will fix any frontend issues and start both the frontend and backend.

2. **Start Application (if already fixed)**:
   ```
   start-app.bat
   ```
   This script will start both the frontend and backend.

3. **Start Frontend Only**:
   ```
   start-frontend.bat
   ```
   This script will start only the frontend.

4. **Start Backend Only**:
   ```
   start-backend.bat
   ```
   This script will start only the backend.

## Manual Startup

If you prefer to start the application manually, follow these steps:

### Step 1: Install Dependencies

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   npm install react-scripts --save
   cd ..
   ```

   Or use the npm script:
   ```bash
   npm run install:all
   ```

### Step 2: Start the Application

1. Start both frontend and backend:
   ```bash
   npm run dev:both
   ```
   Or:
   ```bash
   npm run start:app
   ```

2. Start only the backend:
   ```bash
   npm run backend
   ```

3. Start only the frontend:
   ```bash
   npm run frontend
   ```

## Fixing Common Issues

### 'react-scripts' is not recognized

If you encounter the error "'react-scripts' is not recognized", run:
```bash
npm run fix:frontend
```
Or:
```
fix-frontend.bat
```

This will install the necessary dependencies in the frontend directory.

### MongoDB Connection Issues

If you encounter MongoDB connection issues, make sure:
1. MongoDB is installed and running
2. Your .env file has the correct MongoDB URI
3. If using a remote MongoDB, check your network connection

### Port Already in Use

If you see an error that a port is already in use:
1. Find the process using the port:
   ```bash
   # For port 3000 (frontend)
   netstat -ano | findstr :3000
   # For port 5001 (backend)
   netstat -ano | findstr :5001
   ```

2. Kill the process:
   ```bash
   taskkill /PID <process_id> /F
   ```

## Application URLs

Once the application is running, you can access it at:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **API Documentation**: http://localhost:5001/api-docs

## Need More Help?

If you need more help with starting the application, please refer to the main README.md file or contact the development team.