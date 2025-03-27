const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run the standard React build
console.log('Running standard React build...');
try {
  execSync('react-scripts build', { stdio: 'inherit' });
} catch (error) {
  console.error('React build failed:', error);
  process.exit(1);
}

// Copy our custom HTML files to the build directory
console.log('Copying custom HTML files...');
const htmlFiles = ['App.html', 'legal-actions.html'];
htmlFiles.forEach(file => {
  try {
    if (fs.existsSync(path.join(__dirname, file))) {
      fs.copyFileSync(
        path.join(__dirname, file),
        path.join(__dirname, 'build', file)
      );
      console.log(`Copied ${file} to build directory`);
    } else {
      console.warn(`Warning: ${file} not found`);
    }
  } catch (error) {
    console.error(`Error copying ${file}:`, error);
  }
});

// Copy our custom CSS files to the build directory
console.log('Copying custom CSS files...');
const cssFiles = ['App.css', 'legal-actions.css'];
cssFiles.forEach(file => {
  try {
    if (fs.existsSync(path.join(__dirname, file))) {
      fs.copyFileSync(
        path.join(__dirname, file),
        path.join(__dirname, 'build', file)
      );
      console.log(`Copied ${file} to build directory`);
    } else {
      console.warn(`Warning: ${file} not found`);
    }
  } catch (error) {
    console.error(`Error copying ${file}:`, error);
  }
});

// Copy our custom JS files to the build directory
console.log('Copying custom JS files...');
const jsFiles = ['App.js', 'legal-actions.js'];
jsFiles.forEach(file => {
  try {
    if (fs.existsSync(path.join(__dirname, file))) {
      fs.copyFileSync(
        path.join(__dirname, file),
        path.join(__dirname, 'build', file)
      );
      console.log(`Copied ${file} to build directory`);
    } else {
      console.warn(`Warning: ${file} not found`);
    }
  } catch (error) {
    console.error(`Error copying ${file}:`, error);
  }
});

console.log('Custom build completed successfully!');