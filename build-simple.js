import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const frontendPath = path.join(__dirname, 'frontend');
const buildPath = path.join(frontendPath, 'build');

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

// Function to copy files
const copyFile = (src, dest) => {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${src} to ${dest}`);
    } else {
      console.warn(`Warning: Source file not found: ${src}`);
    }
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error);
  }
};

// Main function
const buildSimple = async () => {
  try {
    // 1. Ensure build directory exists
    ensureDirectoryExists(buildPath);
    
    // 2. Copy HTML files
    console.log('Copying HTML files...');
    copyFile(
      path.join(frontendPath, 'App.html'),
      path.join(buildPath, 'App.html')
    );
    copyFile(
      path.join(frontendPath, 'legal-actions.html'),
      path.join(buildPath, 'legal-actions.html')
    );
    
    // 3. Copy CSS files
    console.log('Copying CSS files...');
    copyFile(
      path.join(frontendPath, 'App.css'),
      path.join(buildPath, 'App.css')
    );
    copyFile(
      path.join(frontendPath, 'legal-actions.css'),
      path.join(buildPath, 'legal-actions.css')
    );
    
    // 4. Copy JS files
    console.log('Copying JS files...');
    copyFile(
      path.join(frontendPath, 'App.js'),
      path.join(buildPath, 'App.js')
    );
    copyFile(
      path.join(frontendPath, 'legal-actions.js'),
      path.join(buildPath, 'legal-actions.js')
    );
    
    // 5. Create index.html
    console.log('Creating index.html...');
    const indexHtml = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0;url=App.html">
    <title>Virtual Lawyer</title>
</head>
<body>
    Redirecting to <a href="App.html">App.html</a>...
</body>
</html>`;
    fs.writeFileSync(path.join(buildPath, 'index.html'), indexHtml);
    
    console.log('Simple build completed successfully!');
    
    // 6. Copy build to backend/frontend/build
    console.log('Copying build to backend...');
    const backendFrontendPath = path.join(__dirname, 'frontend', 'build');
    ensureDirectoryExists(backendFrontendPath);
    
    // List all files in build directory
    const files = fs.readdirSync(buildPath);
    for (const file of files) {
      copyFile(
        path.join(buildPath, file),
        path.join(backendFrontendPath, file)
      );
    }
    
    console.log('Build copied to backend successfully!');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

// Run the build process
buildSimple();