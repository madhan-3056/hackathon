# Local Development Guide

This guide provides comprehensive instructions for setting up and working with the Virtual Lawyer application in your local development environment.

## Quick Start

For the fastest way to get started:

```bash
# Windows
run-enhanced.bat

# Mac/Linux
chmod +x run-enhanced.sh
./run-enhanced.sh
```

This will:
1. Install all dependencies
2. Build the frontend
3. Start the server
4. Open the application in your browser

Your application will be available at: http://localhost:5001

## Development Options

### Standard Development

Run the application with standard Node.js:

```bash
# Windows
run-dev.bat
# Select option 1

# Mac/Linux
chmod +x run-dev.sh
./run-dev.sh
# Select option 1
```

### Development with Auto-Reload

Run the application with Nodemon for automatic reloading when you make changes:

```bash
# Windows
run-dev.bat
# Select option 2

# Mac/Linux
chmod +x run-dev.sh
./run-dev.sh
# Select option 2
```

### Development with Debugging

Run the application with Node.js debugging enabled:

```bash
# Windows
run-dev.bat
# Select option 3

# Mac/Linux
chmod +x run-dev.sh
./run-dev.sh
# Select option 3
```

Then open Chrome and navigate to `chrome://inspect` to connect to the debugger.

## Project Structure

```
/
├── frontend/                # React frontend
│   ├── public/              # Public assets
│   ├── src/                 # React source code
│   └── package.json         # Frontend dependencies
├── config/                  # Backend configuration
├── controllers/             # API controllers
├── middlewares/             # Express middlewares
├── models/                  # Database models
├── routes/                  # API routes
├── services/                # Business logic services
├── utils/                   # Utility functions
├── .env                     # Environment variables
├── server-enhanced.js       # Enhanced server for development
├── server-combined.js       # Combined server for production
└── package.json             # Project dependencies
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/virtual_lawyer
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

## Database Setup

### MongoDB Installation

#### Windows
1. Download and install MongoDB Community Server from [MongoDB website](https://www.mongodb.com/try/download/community)
2. Follow the installation wizard
3. MongoDB will run as a service automatically

#### Mac
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Database Management

To manage your MongoDB database:
1. Install MongoDB Compass from [MongoDB website](https://www.mongodb.com/products/compass)
2. Connect to: `mongodb://localhost:27017/virtual_lawyer`

## API Testing

### Using the Test Script

Run the API test script:

```bash
node test-api.js
```

### Manual API Testing

You can test the API endpoints using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5001/api/v1/health

# Status check
curl http://localhost:5001/status

# Auth endpoints
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Debugging Techniques

### Backend Debugging

1. Start the server with debugging enabled:
   ```bash
   node --inspect server-enhanced.js
   ```

2. Open Chrome and navigate to `chrome://inspect`

3. Click on "Open dedicated DevTools for Node"

### Frontend Debugging

1. Open your browser's developer tools (F12 or Ctrl+Shift+I)

2. Navigate to the "Sources" tab to set breakpoints in your JavaScript code

3. Use the "Console" tab to view logs and errors

4. Install React Developer Tools extension for better component inspection

## Performance Optimization

### Backend Optimization

1. Use indexes for frequently queried fields in MongoDB:
   ```javascript
   // In your user model
   UserSchema.index({ email: 1 });
   ```

2. Implement caching for expensive operations:
   ```javascript
   const cache = {};
   
   function getDataWithCache(key, fetchFunction) {
     if (cache[key]) return cache[key];
     const data = fetchFunction();
     cache[key] = data;
     return data;
   }
   ```

### Frontend Optimization

1. Use React.memo for components that render often but with the same props:
   ```javascript
   const MyComponent = React.memo(function MyComponent(props) {
     // Component code
   });
   ```

2. Lazy load components that aren't immediately needed:
   ```javascript
   const LazyComponent = React.lazy(() => import('./LazyComponent'));
   ```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find the process using the port
   # Windows
   netstat -ano | findstr :5001
   # Mac/Linux
   lsof -i :5001
   
   # Kill the process
   # Windows
   taskkill /PID <process_id> /F
   # Mac/Linux
   kill -9 <process_id>
   ```

2. **MongoDB connection issues**
   - Check if MongoDB is running:
     ```bash
     # Windows
     sc query MongoDB
     # Mac
     brew services list
     # Linux
     sudo systemctl status mongodb
     ```
   - Try connecting with the MongoDB shell:
     ```bash
     mongo
     ```

3. **Frontend build issues**
   - Clear node_modules and reinstall:
     ```bash
     cd frontend
     rm -rf node_modules
     npm install
     ```
   - Make sure you have the correct version of Node.js:
     ```bash
     node -v  # Should be v14 or higher
     ```

4. **"react-scripts not found" error**
   - Run the fix script:
     ```bash
     npm run fix:frontend
     ```

## Advanced Development

### Using HTTPS Locally

1. Install mkcert:
   ```bash
   npm install -g mkcert
   ```

2. Create certificates:
   ```bash
   mkcert create-ca
   mkcert create-cert localhost
   ```

3. Update your server code to use HTTPS:
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('localhost-key.pem'),
     cert: fs.readFileSync('localhost.pem')
   };
   
   https.createServer(options, app).listen(5001);
   ```

### Sharing Your Local Environment

To share your local environment with others:

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Start your application:
   ```bash
   node server-enhanced.js
   ```

3. In a new terminal, start ngrok:
   ```bash
   ngrok http 5001
   ```

4. Share the ngrok URL with others

## Additional Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)