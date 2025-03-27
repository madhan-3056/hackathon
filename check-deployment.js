// Script to check if the application is ready for deployment
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

console.log('===== Deployment Readiness Check =====');

// Check required files
const requiredFiles = [
    'server-combined.js',
    'package.json',
    'ecosystem.config.js',
    'Dockerfile',
    'docker-compose.yml',
    'Procfile'
];

console.log('\nChecking required files:');
let allFilesPresent = true;
for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    console.log(`- ${file}: ${exists ? 'Present' : 'MISSING'}`);
    if (!exists) {
        allFilesPresent = false;
    }
}

// Check environment variables
const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'JWT_COOKIE_EXPIRE',
    'CLAUDE_API_KEY'
];

console.log('\nChecking environment variables:');
let allEnvVarsPresent = true;
for (const envVar of requiredEnvVars) {
    const isPresent = process.env[envVar] !== undefined;
    console.log(`- ${envVar}: ${isPresent ? 'Present' : 'MISSING'}`);
    if (!isPresent) {
        allEnvVarsPresent = false;
    }
}

// Check deployment scripts
const deploymentScripts = [
    'deploy.sh',
    'deploy-docker.sh',
    'deploy-heroku.sh',
    'deploy-windows.bat'
];

console.log('\nChecking deployment scripts:');
let allScriptsPresent = true;
for (const script of deploymentScripts) {
    const scriptPath = path.join(__dirname, script);
    const exists = fs.existsSync(scriptPath);
    console.log(`- ${script}: ${exists ? 'Present' : 'MISSING'}`);
    if (!exists) {
        allScriptsPresent = false;
    }
}

// Check MongoDB connection
console.log('\nChecking MongoDB connection:');
if (process.env.MONGODB_URI) {
    console.log(`- MongoDB URI: ${process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    console.log('- Note: Actual connection test requires running the application');
} else {
    console.log('- MongoDB URI: MISSING');
}

// Check Claude API key
console.log('\nChecking Claude API key:');
if (process.env.CLAUDE_API_KEY) {
    console.log(`- Claude API key: ${process.env.CLAUDE_API_KEY.substring(0, 10)}...`);
} else {
    console.log('- Claude API key: MISSING');
}

// Overall readiness
console.log('\n===== Deployment Readiness Summary =====');
console.log(`Required files: ${allFilesPresent ? 'All present' : 'Some missing'}`);
console.log(`Environment variables: ${allEnvVarsPresent ? 'All present' : 'Some missing'}`);
console.log(`Deployment scripts: ${allScriptsPresent ? 'All present' : 'Some missing'}`);

if (allFilesPresent && allEnvVarsPresent && allScriptsPresent) {
    console.log('\nYour application is READY for deployment!');
    console.log('To deploy, use one of the following methods:');
    console.log('1. VPS deployment: ./deploy.sh your-server-ip your-username');
    console.log('2. Docker deployment: ./deploy-docker.sh your-server-ip your-username');
    console.log('3. Heroku deployment: ./deploy-heroku.sh your-app-name');
    console.log('4. Windows deployment: deploy-windows.bat');
} else {
    console.log('\nYour application is NOT READY for deployment.');
    console.log('Please fix the issues listed above before deploying.');
}

console.log('\nFor detailed deployment instructions, see DEPLOYMENT.md');