# Virtual Lawyer

An AI-powered legal assistant for document analysis and compliance.

## Project Structure

This project combines a Node.js/Express backend with a React frontend. The backend provides API endpoints for authentication, document management, compliance checking, and chat functionality. The frontend provides a user interface for interacting with these features.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd virtual-lawyer
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/virtual_lawyer
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

### 3. Install Dependencies and Run the Application

#### Option 1: Quick Start (Recommended)

The easiest way to start the application is to use the provided start scripts:

**Windows:**
```
start.bat
```
This will show a menu with options to:
- Fix frontend issues and start application
- Start application (if already fixed)
- Start frontend only
- Start backend only
- Install all dependencies
- View startup guide

**Mac/Linux:**
```
chmod +x start.sh
./start.sh
```

**Directly with Node.js:**
```
node start.js
```

**Fix Frontend Issues:**
If you encounter the error "'react-scripts' is not recognized", run:
```
fix-frontend.bat
```
Or:
```bash
npm run fix:frontend
```

#### Option 2: Using npm

```bash
# Install dependencies
npm install

# Start the application
node server-combined.js
```

#### Option 3: Development Mode (Frontend and Backend Separately)

This is useful for development as it allows you to see changes in real-time.

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Run both frontend and backend concurrently
npm run dev:both
```

### 4. Access the Application

Once the application is running, you can access it at:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **API Documentation**: http://localhost:5001/api-docs

You can also use the provided script to open the application in your browser:
```
open-app.bat
```

For more detailed instructions on starting and troubleshooting the application, see [START-APP-GUIDE.md](START-APP-GUIDE.md)

## AI Integration

This application uses Claude AI API for document analysis and legal term explanations. To use these features:

1. Make sure you have a Claude API key (sign up at https://console.anthropic.com/)
2. Add your API key to the `.env` file: `CLAUDE_API_KEY=your_api_key_here`
3. Update your .env file:
   - Windows: Run `update-env.bat`
   - Mac/Linux: Run `chmod +x update-env.sh` and then `./update-env.sh`
4. Test the Claude AI integration:
   - Windows: Run `test-claude.bat`
   - Mac/Linux: Run `node test-claude.js`

If you don't have a Claude API key, the application will use mock data for AI features.

## Troubleshooting

If you encounter any issues:

1. **Check Dependencies**: Run `node check-dependencies.js` to check for missing dependencies
2. **Check Environment Variables**: Run `node test-env.js` to verify environment variables are loaded correctly
3. **Test Application**: Run `node test-app.js` to test if the application can start without errors
4. **Test AI Integration**: Run `node test-claude.js` to test if the Claude AI integration is working correctly
5. **Update Environment File**: Run `update-env.bat` (Windows) or `./update-env.sh` (Mac/Linux) to update your .env file with the latest configuration

### Common Issues

1. **Module not found errors**: Make sure you have installed all dependencies by running `npm install`
2. **'react-scripts' is not recognized**: Run `fix-frontend.bat` or `npm run fix:frontend` to fix this issue
3. **AI features not working**: If you don't have a Claude API key, the application will use mock data for AI features
4. **Database connection errors**: If you're having issues connecting to MongoDB, try using a local MongoDB instance by updating the MONGODB_URI in your .env file
5. **Port already in use**: If a port is already in use, find and terminate the process using that port:
   ```bash
   # For port 3000 (frontend)
   netstat -ano | findstr :3000
   # For port 5001 (backend)
   netstat -ano | findstr :5001
   # Kill the process
   taskkill /PID <process_id> /F
   ```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user

### Documents

- `GET /api/v1/documents` - Get all documents
- `POST /api/v1/documents` - Create a new document
- `POST /api/v1/documents/:id/analyze` - Analyze a document

### Compliance

- `POST /api/v1/compliance/check` - Check compliance of a document

### Chat

- `GET /api/v1/chat/messages` - Get chat messages
- `POST /api/v1/chat/messages` - Send a chat message

## Frontend Development

The frontend is built with React and is located in the `frontend` directory. To work on the frontend separately:

```bash
cd frontend
npm start
```

This will start the React development server on port 3000.

## Backend Development

The backend is built with Node.js/Express and is located in the root directory. To work on the backend separately:

```bash
node server-combined.js
```

This will start the backend server on port 5001.

## Deployment

The application can be deployed using several methods:

### Quick Deployment

1. For VPS deployment:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh your-server-ip your-username
   ```

2. For Docker deployment:
   ```bash
   chmod +x deploy-docker.sh
   ./deploy-docker.sh your-server-ip your-username
   ```

3. For Heroku deployment:
   ```bash
   chmod +x deploy-heroku.sh
   ./deploy-heroku.sh your-app-name
   ```

4. For live production server deployment:
   ```bash
   chmod +x deploy-live.sh
   ./deploy-live.sh your-server-ip your-username your-ssh-port your-domain.com
   ```

5. For Windows users:
   ```
   deploy-windows.bat   # General deployment helper
   deploy-live.bat      # Live server deployment
   ```

### Manual Deployment

1. Set the environment variables for production
2. Build the application: `node build-deploy.js`
3. Start the server: `node server-combined.js`

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## License

ISC