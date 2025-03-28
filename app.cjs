const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes.cjs');
const complianceRoutes = require('./routes/complianceRoutes');
const chatRoutes = require('./routes/chatRoutes.cjs');
const aiRoutes = require('./routes/aiRoutes');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/compliance', complianceRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/ai', aiRoutes);

// Error handler middleware
app.use(errorHandler);

module.exports = app;