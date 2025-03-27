import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
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

app.use(express.static(frontendBuildPath));

// Serve index.html for any route not handled by the API
app.get('*', (req, res) => {
  res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use`);
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