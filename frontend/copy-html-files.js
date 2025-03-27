const fs = require('fs');
const path = require('path');

// Define the files to copy
const filesToCopy = [
  { source: 'App.html', destination: 'build/App.html' },
  { source: 'App.css', destination: 'build/App.css' },
  { source: 'App.js', destination: 'build/App.js' },
  { source: 'legal-actions.html', destination: 'build/legal-actions.html' },
  { source: 'legal-actions.css', destination: 'build/legal-actions.css' },
  { source: 'legal-actions.js', destination: 'build/legal-actions.js' }
];

// Create build directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'build'))) {
  fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true });
  console.log('Created build directory');
}

// Copy each file
filesToCopy.forEach(file => {
  try {
    if (fs.existsSync(path.join(__dirname, file.source))) {
      fs.copyFileSync(
        path.join(__dirname, file.source),
        path.join(__dirname, file.destination)
      );
      console.log(`Copied ${file.source} to ${file.destination}`);
    } else {
      console.warn(`Warning: ${file.source} not found`);
    }
  } catch (error) {
    console.error(`Error copying ${file.source}:`, error);
  }
});

// Create a simple index.html that redirects to App.html if it doesn't exist
const indexHtmlPath = path.join(__dirname, 'build', 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
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
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log('Created fallback index.html');
}

console.log('All files copied successfully!');