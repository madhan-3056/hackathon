// Script to test the connection between frontend and backend
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${PORT}`;

console.log('===== Testing Frontend-Backend Connection =====');

// Check if backend is running
async function testBackendConnection() {
  try {
    console.log(`Testing connection to backend at ${BASE_URL}...`);
    const response = await axios.get(`${BASE_URL}/api/v1/auth/test`);
    console.log('Backend connection successful!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection failed:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the backend running?');
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Check if frontend build exists
function checkFrontendBuild() {
  const frontendBuildPath = path.join(__dirname, 'frontend', 'build');
  const indexHtmlPath = path.join(frontendBuildPath, 'index.html');
  
  console.log(`Checking for frontend build at ${frontendBuildPath}...`);
  
  if (fs.existsSync(frontendBuildPath) && fs.existsSync(indexHtmlPath)) {
    console.log('Frontend build found!');
    return true;
  } else {
    console.error('Frontend build not found. Please build the frontend first.');
    console.error('Run: cd frontend && npm run build');
    return false;
  }
}

// Check if server-combined.js is properly configured
function checkServerConfig() {
  const serverPath = path.join(__dirname, 'server-combined.js');
  
  console.log(`Checking server configuration at ${serverPath}...`);
  
  if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Check if server is configured to serve static files
    if (serverContent.includes('app.use(express.static(') && 
        serverContent.includes('app.get(\'*\'')) {
      console.log('Server is properly configured to serve frontend!');
      return true;
    } else {
      console.error('Server is not properly configured to serve frontend.');
      return false;
    }
  } else {
    console.error('Server file not found.');
    return false;
  }
}

// Run all tests
async function runTests() {
  const backendConnected = await testBackendConnection();
  const frontendBuilt = checkFrontendBuild();
  const serverConfigured = checkServerConfig();
  
  console.log('\n===== Test Results =====');
  console.log(`Backend Connection: ${backendConnected ? 'PASS' : 'FAIL'}`);
  console.log(`Frontend Build: ${frontendBuilt ? 'PASS' : 'FAIL'}`);
  console.log(`Server Configuration: ${serverConfigured ? 'PASS' : 'FAIL'}`);
  
  if (backendConnected && frontendBuilt && serverConfigured) {
    console.log('\nAll tests passed! Your application is ready for deployment.');
    console.log(`Your application should be accessible at: http://localhost:${PORT}`);
  } else {
    console.log('\nSome tests failed. Please fix the issues before deploying.');
  }
}

runTests();