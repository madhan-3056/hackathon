import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const backendPath = __dirname;
const frontendPath = path.join(__dirname, 'frontend');
const frontendBuildPath = path.join(frontendPath, 'build');
const backendFrontendPath = path.join(backendPath, 'frontend', 'build');

// Function to execute shell commands
const execCommand = (command, cwd) => {
    return new Promise((resolve, reject) => {
        console.log(`Executing: ${command} in ${cwd || 'current directory'}`);

        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return reject(error);
            }

            if (stderr) {
                console.warn(`Warning: ${stderr}`);
            }

            console.log(`Output: ${stdout}`);
            resolve(stdout);
        });
    });
};

// Function to create directory if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
};

// Main function to build and deploy
const buildAndDeploy = async () => {
    try {
        // 1. Install backend dependencies
        console.log('Installing backend dependencies...');
        await execCommand('npm install', backendPath);

        // 2. Check if frontend directory exists
        if (!fs.existsSync(frontendPath)) {
            console.error('Frontend directory not found. Please make sure the frontend code is in a directory named "frontend" in the project root.');
            process.exit(1);
        }

        // 3. Install frontend dependencies
        console.log('Installing frontend dependencies...');
        await execCommand('npm install', frontendPath);

        // 4. Build frontend
        console.log('Building frontend...');
        await execCommand('npm run build', frontendPath);

        // 5. Create frontend/build directory in backend if it doesn't exist
        ensureDirectoryExists(path.join(backendPath, 'frontend'));
        ensureDirectoryExists(backendFrontendPath);

        // 6. Copy frontend build to backend
        console.log('Copying frontend build to backend...');

        if (process.platform === 'win32') {
            // Windows
            await execCommand(`xcopy "${frontendBuildPath}" "${backendFrontendPath}" /E /I /Y`);
        } else {
            // Unix-like
            await execCommand(`cp -R "${frontendBuildPath}/"* "${backendFrontendPath}"`);
        }

        console.log('Frontend build copied successfully!');

        // 7. Start the combined server
        console.log('Starting the combined server...');
        await execCommand('node server-combined.js', backendPath);

    } catch (error) {
        console.error('Build and deploy failed:', error);
        process.exit(1);
    }
};

// Run the build and deploy process
buildAndDeploy();