// Test script to verify environment variables are loaded correctly
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting environment variables test...');

// Load environment variables
dotenv.config();

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);
console.log('.env file exists:', envExists);

if (envExists) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log('Number of non-empty, non-comment lines in .env file:', envLines.length);
}

// Check environment variables
const requiredVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'JWT_COOKIE_EXPIRE'
];

const optionalVars = [
    'OPENAI_API_KEY',
    'EMAIL_SERVICE',
    'EMAIL_USERNAME',
    'EMAIL_PASSWORD',
    'FROM_EMAIL'
];

console.log('\nRequired environment variables:');
let allRequiredVarsPresent = true;
for (const varName of requiredVars) {
    const isPresent = process.env[varName] !== undefined;
    console.log(`- ${varName}: ${isPresent ? 'Present' : 'MISSING'}`);
    if (!isPresent) {
        allRequiredVarsPresent = false;
    }
}

console.log('\nOptional environment variables:');
for (const varName of optionalVars) {
    const isPresent = process.env[varName] !== undefined;
    console.log(`- ${varName}: ${isPresent ? 'Present' : 'Not present'}`);
}

console.log('\nEnvironment variables test result:', allRequiredVarsPresent ? 'PASSED' : 'FAILED');

// Print actual values for debugging (without sensitive data)
console.log('\nEnvironment variable values:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '******' : 'not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '******' : 'not set');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('JWT_COOKIE_EXPIRE:', process.env.JWT_COOKIE_EXPIRE);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '******' : 'not set');

console.log('\nEnvironment variables test completed.');