// Simple deployment script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting simple deployment process...');

// Function to execute commands and log output
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    const output = execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Main deployment function
async function deploy() {
  try {
    // 1. Install backend dependencies
    console.log('\n=== Installing backend dependencies ===');
    if (!runCommand('npm install')) {
      throw new Error('Failed to install backend dependencies');
    }

    // 2. Install frontend dependencies
    console.log('\n=== Installing frontend dependencies ===');
    if (!runCommand('cd frontend && npm install')) {
      // Try to fix frontend issues
      console.log('Attempting to fix frontend issues...');
      if (!runCommand('cd frontend && npm install react-scripts --save')) {
        throw new Error('Failed to install frontend dependencies');
      }
    }

    // 3. Build frontend
    console.log('\n=== Building frontend ===');
    if (!runCommand('cd frontend && npm run build')) {
      throw new Error('Failed to build frontend');
    }

    // 4. Ensure build directory exists
    const buildDir = path.join(__dirname, 'frontend', 'build');
    if (!fs.existsSync(buildDir)) {
      console.error('Frontend build directory not found!');
      throw new Error('Frontend build failed');
    }

    // 5. Test Claude API
    console.log('\n=== Testing Claude API ===');
    runCommand('node test-claude-simple.cjs');

    // 6. Start the server
    console.log('\n=== Deployment successful! ===');
    console.log('You can now start the server with: npm start');

    return true;
  } catch (error) {
    console.error('\n=== Deployment failed ===');
    console.error(error.message);
    return false;
  }
}

// Run the deployment
deploy()
  .then(success => {
    if (success) {
      console.log('Deployment completed successfully!');
      process.exit(0);
    } else {
      console.error('Deployment failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error during deployment:', error);
    process.exit(1);
  });