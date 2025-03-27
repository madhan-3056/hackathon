// Simple script to run the application with Claude API
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting Virtual Lawyer application with Claude AI...');

// Update .env file with Claude API key
try {
    console.log('Updating .env file with Claude API key...');

    const envClaudePath = path.join(__dirname, '.env.claude');
    const envPath = path.join(__dirname, '.env');

    if (fs.existsSync(envClaudePath)) {
        fs.copyFileSync(envClaudePath, envPath);
        console.log('.env file updated successfully!');
    } else {
        console.error('.env.claude file not found!');
        process.exit(1);
    }
} catch (error) {
    console.error('Error updating .env file:', error.message);
    process.exit(1);
}

// Start the application
console.log('Starting application...');

const nodeProcess = spawn('node', ['server-combined.js'], {
    stdio: 'inherit',
    shell: true
});

nodeProcess.on('error', (error) => {
    console.error('Error starting application:', error.message);
});

nodeProcess.on('close', (code) => {
    console.log(`Application exited with code ${code}`);
});