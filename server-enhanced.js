import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import fs from 'fs';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load env vars
dotenv.config();

// Log environment variables (without sensitive data)
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? '******' : 'not set',
  JWT_SECRET: process.env.JWT_SECRET ? '******' : 'not set',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '******' : 'not set'
});

// Connect to database
try {
  const connected = await connectDB();
  if (!connected) {
    console.warn('Warning: Application running without database connection');
  }
} catch (err) {
  console.error('Failed to connect to database:', err.message);
  console.warn('Warning: Application running without database connection');
}

const app = express();
const server = http.createServer(app);

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Add status endpoint for monitoring
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    time: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    version: process.version,
    platform: process.platform
  });
});

// Add health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date()
  });
});

// Mount API routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/compliance', complianceRoutes);
app.use('/api/v1/chat', chatRoutes);

// Set up WebSocket for real-time chat if available
try {
  const chatService = await import('./services/chatService.js');
  chatService.setupWebSocket(server);
  console.log('WebSocket server initialization started');
} catch (err) {
  console.log('WebSocket server not initialized:', err.message);
}

// Serve static assets in production
// Check if frontend/build directory exists
const frontendBuildPath = path.resolve(__dirname, 'frontend', 'build');

// Ensure the frontend build directory exists
if (!fs.existsSync(frontendBuildPath)) {
  console.warn(`Warning: Frontend build directory not found at ${frontendBuildPath}`);
  console.warn('The application may not function correctly without the frontend build.');
  console.warn('Run "cd frontend && npm run build" to create the build directory.');
  
  // Create a simple HTML page to show when frontend build is missing
  const tempDir = path.resolve(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  const tempHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Virtual Lawyer - Frontend Not Built</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
      h1 { color: #333; }
      .error { color: #e74c3c; background: #fceaea; padding: 10px; border-radius: 5px; }
      .code { background: #f4f4f4; padding: 10px; border-radius: 5px; font-family: monospace; }
      .button { display: inline-block; background: #3498db; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; }
    </style>
  </head>
  <body>
    <h1>Virtual Lawyer</h1>
    <div class="error">
      <h2>Frontend Not Built</h2>
      <p>The frontend build directory was not found. The API endpoints are working, but the user interface is not available.</p>
    </div>
    <h3>To fix this issue:</h3>
    <div class="code">
      <p>cd frontend</p>
      <p>npm install</p>
      <p>npm run build</p>
      <p>cd ..</p>
      <p>node server-enhanced.js</p>
    </div>
    <h3>API Status</h3>
    <p>The API is running and can be accessed at <a href="/api/v1/health">/api/v1/health</a></p>
    <p>For detailed status information, visit <a href="/status">/status</a></p>
    <p><a href="javascript:location.reload()" class="button">Refresh Page</a></p>
  </body>
  </html>
  `;
  
  fs.writeFileSync(path.resolve(tempDir, 'index.html'), tempHtml);
  app.use(express.static(tempDir));
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
      // Let API requests pass through to the API routes
      return next();
    }
    res.sendFile(path.resolve(tempDir, 'index.html'));
  });
} else {
  // Serve the frontend build
  app.use(express.static(frontendBuildPath));
  
  // Serve index.html for any route not handled by the API
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
      // Let API requests pass through to the API routes
      return next();
    }
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
  });
}

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
  console.log(`API health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`Server status: http://localhost:${PORT}/status`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use`);
    console.log(`Try running on a different port: PORT=5002 node server-enhanced.js`);
  } else {
    console.error(err);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});