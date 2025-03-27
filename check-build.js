import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const frontendBuildPath = path.join(__dirname, 'frontend', 'build');

console.log('Checking build directory...');

// Check if build directory exists
if (!fs.existsSync(frontendBuildPath)) {
    console.error(`Error: Build directory not found at ${frontendBuildPath}`);
    process.exit(1);
}

console.log(`Build directory exists at ${frontendBuildPath}`);

// Check for essential files
const essentialFiles = [
    'index.html',
    'App.html',
    'App.css',
    'App.js',
    'legal-actions.html',
    'legal-actions.css',
    'legal-actions.js'
];

const missingFiles = [];

essentialFiles.forEach(file => {
    const filePath = path.join(frontendBuildPath, file);
    if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
    }
});

if (missingFiles.length > 0) {
    console.error(`Error: The following essential files are missing: ${missingFiles.join(', ')}`);

    // If index.html is missing but App.html exists, create a simple index.html
    if (missingFiles.includes('index.html') && !missingFiles.includes('App.html')) {
        console.log('Creating index.html that redirects to App.html...');
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
        fs.writeFileSync(path.join(frontendBuildPath, 'index.html'), indexHtml);
        console.log('Created index.html');
        missingFiles.splice(missingFiles.indexOf('index.html'), 1);
    }

    if (missingFiles.length > 0) {
        process.exit(1);
    }
}

console.log('All essential files are present in the build directory');
console.log('Build check completed successfully!');