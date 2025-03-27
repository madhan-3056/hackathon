import mongoose from 'mongoose';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    let uri = process.env.MONGODB_URI;

    // Check if the URI contains a placeholder for the password
    if (uri && uri.includes('<db_password>')) {
      console.warn('Warning: MongoDB URI contains <db_password> placeholder. Using local MongoDB instead.');
      uri = 'mongodb://localhost:27017/virtual_lawyer';
    }

    // If no URI is provided, use local MongoDB
    if (!uri) {
      console.warn('Warning: No MongoDB URI provided. Using local MongoDB instead.');
      uri = 'mongodb://localhost:27017/virtual_lawyer';
    }

    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
    return true;
  } catch (err) {
    console.error('Database connection error:', err.message);

    // Don't exit the process, just return false to indicate failure
    return false;
  }
};

export default connectDB;

// For CommonJS compatibility
if (typeof module !== 'undefined') {
  module.exports = connectDB;
}