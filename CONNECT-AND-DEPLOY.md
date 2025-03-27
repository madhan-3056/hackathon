# Connecting Frontend and Backend and Deploying to a Live Server

This guide provides detailed instructions for connecting the frontend (HTML, CSS, JS) with the backend and deploying the application to a live server.

## Understanding the Connection Between Frontend and Backend

In this application:

1. The frontend is built with React and is located in the `frontend` directory.
2. The backend is built with Node.js/Express and is located in the root directory.
3. During development, the frontend runs on port 3000 and the backend runs on port 5001.
4. For production, the backend serves the frontend static files from the `frontend/build` directory.

## Step 1: Configure the Frontend to Connect to the Backend

The frontend connects to the backend through API calls. This connection is configured in the `frontend/package.json` file with the `proxy` field:

```json
"proxy": "http://localhost:5001"
```

This tells the frontend development server to proxy API requests to the backend server running on port 5001.

## Step 2: Build the Frontend for Production

To build the frontend for production:

```bash
# Using npm script
npm run build:frontend

# Or manually
cd frontend
npm run build
cd ..
```

This creates a production build of the frontend in the `frontend/build` directory.

## Step 3: Configure the Backend to Serve the Frontend

The backend is configured to serve the frontend static files in the `server-combined.js` file:

```javascript
// Serve static assets in production
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Serve index.html for any route not handled by the API
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});
```

This configuration serves the frontend static files and routes all non-API requests to the frontend's index.html file.

## Step 4: Build the Application for Deployment

To build the entire application for deployment:

```bash
# Using npm script
npm run build:deploy

# Or using batch file (Windows)
build-for-deployment.bat

# Or using shell script (Mac/Linux)
./build-for-deployment.sh
```

This script:
1. Installs backend dependencies
2. Installs frontend dependencies
3. Builds the frontend
4. Copies the frontend build to the backend

## Step 5: Test the Connection Between Frontend and Backend

To test the connection between the frontend and backend:

```bash
# Using npm script
npm run test:connection

# Or using batch file (Windows)
test-connection.bat

# Or using Node.js
node test-connection.js
```

This script checks:
1. If the backend is running and accessible
2. If the frontend build exists
3. If the server is properly configured to serve the frontend

## Step 6: Deploy to a Live Server

### Option 1: Deploy to a VPS or Dedicated Server

```bash
# Using npm script
npm run deploy:live

# Or using batch file (Windows)
deploy-live.bat

# Or using shell script (Mac/Linux)
./deploy-live.sh your-server-ip your-username your-ssh-port your-domain.com
```

This script:
1. Builds the application for deployment
2. Copies the application files to the server
3. Sets up the server with Node.js, MongoDB, PM2, and Nginx
4. Configures SSL with Let's Encrypt
5. Starts the application with PM2

### Option 2: Deploy to Heroku

```bash
# Using npm script
npm run deploy:heroku

# Or using shell script
./deploy-heroku.sh your-app-name
```

### Option 3: Deploy with Docker

```bash
# Using npm script
npm run deploy:docker

# Or using shell script
./deploy-docker.sh your-server-ip your-username
```

## Step 7: Access Your Deployed Application

After deployment, your application will be accessible at:

- If deployed to a VPS or dedicated server: `https://your-domain.com`
- If deployed to Heroku: `https://your-app-name.herokuapp.com`
- If deployed with Docker: `http://your-server-ip:5001`

## Troubleshooting

### Frontend Not Loading

If the frontend is not loading:

1. Check if the frontend build exists in the `frontend/build` directory
2. Check if the backend is properly configured to serve the frontend
3. Check if the backend is running

### API Requests Failing

If API requests are failing:

1. Check if the backend is running
2. Check if the frontend is properly configured to connect to the backend
3. Check if the API endpoints are correct

### Deployment Failing

If deployment is failing:

1. Check if the build process completed successfully
2. Check if the server has the required dependencies
3. Check if the server has the required permissions

For more detailed troubleshooting, run:

```bash
npm run deploy:check
```

## Need More Help?

If you need more help with connecting the frontend and backend or deploying to a live server, please refer to the following resources:

- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)