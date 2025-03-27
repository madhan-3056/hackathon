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

// Main function to build for deployment
const buildForDeployment = async () => {
    try {
        console.log('===== Building Virtual Lawyer for Deployment =====');

        // 1. Install backend dependencies
        console.log('\nStep 1: Installing backend dependencies...');
        await execCommand('npm install', backendPath);

        // 2. Install frontend dependencies
        console.log('\nStep 2: Installing frontend dependencies...');
        await execCommand('npm install', frontendPath);
        await execCommand('npm install react-scripts --save', frontendPath);

        // 3. Build frontend
        console.log('\nStep 3: Building frontend...');
        await execCommand('npm run build', frontendPath);

        // 4. Create frontend/build directory in backend if it doesn't exist
        console.log('\nStep 4: Copying frontend build to backend...');
        ensureDirectoryExists(path.join(backendPath, 'frontend'));
        ensureDirectoryExists(backendFrontendPath);

        // 5. Copy frontend build to backend
        if (process.platform === 'win32') {
            // Windows
            await execCommand(`xcopy "${frontendBuildPath}" "${backendFrontendPath}" /E /I /Y`);
        } else {
            // Unix-like
            await execCommand(`cp -R "${frontendBuildPath}/"* "${backendFrontendPath}"`);
        }

        console.log('\n===== Build Complete =====');
        console.log('\nThe application is now ready for deployment.');
        console.log('To deploy to a live server, run:');
        console.log('deploy-live.bat (Windows) or ./deploy-live.sh (Mac/Linux)');

    } catch (error) {
        console.error('Build for deployment failed:', error);
        process.exit(1);
    }
};

// Run the build for deployment process
buildForDeployment();