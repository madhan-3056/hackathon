// Script to check for missing dependencies and install them if needed
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Checking for missing dependencies...');

// Function to execute shell commands
const execCommand = (command) => {
    return new Promise((resolve, reject) => {
        console.log(`Executing: ${command}`);

        exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return reject(error);
            }

            if (stderr) {
                console.warn(`Warning: ${stderr}`);
            }

            resolve(stdout);
        });
    });
};

// Function to check if a package is installed
const isPackageInstalled = (packageName) => {
    try {
        // Try to require the package
        import(packageName).then(() => true).catch(() => false);
        return true;
    } catch (error) {
        return false;
    }
};

// List of required packages
const requiredPackages = [
    'express',
    'mongoose',
    'dotenv',
    'jsonwebtoken',
    'bcryptjs',
    'cors',
    'morgan'
];

// List of optional packages
const optionalPackages = [
    'openai',
    'ws',
    'socket.io',
    'nodemailer'
];

// Check required packages
console.log('\nChecking required packages:');
const missingRequired = [];
for (const pkg of requiredPackages) {
    try {
        // Check if the package is in node_modules
        const pkgPath = path.join(__dirname, 'node_modules', pkg);
        const isInstalled = fs.existsSync(pkgPath);
        console.log(`- ${pkg}: ${isInstalled ? 'Installed' : 'MISSING'}`);

        if (!isInstalled) {
            missingRequired.push(pkg);
        }
    } catch (error) {
        console.error(`Error checking ${pkg}:`, error.message);
        missingRequired.push(pkg);
    }
}

// Check optional packages
console.log('\nChecking optional packages:');
const missingOptional = [];
for (const pkg of optionalPackages) {
    try {
        // Check if the package is in node_modules
        const pkgPath = path.join(__dirname, 'node_modules', pkg);
        const isInstalled = fs.existsSync(pkgPath);
        console.log(`- ${pkg}: ${isInstalled ? 'Installed' : 'Not installed'}`);

        if (!isInstalled) {
            missingOptional.push(pkg);
        }
    } catch (error) {
        console.error(`Error checking ${pkg}:`, error.message);
        missingOptional.push(pkg);
    }
}

// Install missing required packages
if (missingRequired.length > 0) {
    console.log(`\nInstalling missing required packages: ${missingRequired.join(', ')}`);
    try {
        await execCommand(`npm install ${missingRequired.join(' ')}`);
        console.log('Required packages installed successfully!');
    } catch (error) {
        console.error('Failed to install required packages:', error.message);
    }
} else {
    console.log('\nAll required packages are installed!');
}

// Ask to install missing optional packages
if (missingOptional.length > 0) {
    console.log(`\nMissing optional packages: ${missingOptional.join(', ')}`);
    console.log('To install optional packages, run:');
    console.log(`npm install ${missingOptional.join(' ')}`);
} else {
    console.log('\nAll optional packages are installed!');
}

console.log('\nDependency check completed.');