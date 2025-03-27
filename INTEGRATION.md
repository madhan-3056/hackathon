# Frontend and Backend Integration

This document explains how the frontend and backend have been integrated in this project.

## Integration Strategy

We've used the following approach to integrate the frontend (React) and backend (Node.js/Express):

1. **Development Mode**: In development, the frontend and backend run as separate servers:
   - Backend runs on port 5000
   - Frontend runs on port 3000 with a proxy to the backend

2. **Production Mode**: In production, the backend serves the frontend:
   - The frontend is built into static files
   - The backend serves these static files
   - All API requests are handled by the same server

## Key Files for Integration

1. **server-combined.js**: The main server file that handles both API routes and serving the frontend.

2. **build-deploy.js**: A script that automates the build and deployment process:
   - Installs dependencies for both frontend and backend
   - Builds the frontend
   - Copies the frontend build to the backend
   - Starts the combined server

3. **package.json**: Contains scripts for running the application in different modes:
   - `npm start`: Runs the combined server
   - `npm run dev`: Runs the combined server with nodemon for auto-reloading
   - `npm run build`: Builds the application for production
   - `npm run dev:both`: Runs both frontend and backend separately for development

## Directory Structure

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
├── .gitignore               # Git ignore file
├── app.js                   # Express app (ES modules)
├── app.cjs                  # Express app (CommonJS)
├── build-deploy.js          # Build and deployment script
├── index.js                 # Entry point for backend only
├── package.json             # Project dependencies
├── README.md                # Project documentation
└── server-combined.js       # Combined server for production
```

## How to Run

### Development Mode

```bash
# Run frontend and backend separately
npm run dev:both

# Or run them individually
npm run backend
cd frontend && npm start
```

### Production Mode

```bash
# Build and run
npm run build
npm start
```

## API Endpoints

All API endpoints are prefixed with `/api/v1/` to distinguish them from frontend routes.

## Authentication

The frontend communicates with the backend using JWT tokens for authentication.