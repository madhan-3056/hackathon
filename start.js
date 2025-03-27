// Simple starter script that can be run directly with Node.js
console.log('Starting Virtual Lawyer application...');

// Import and run the server-combined.js file
import('./server-combined.js').catch(err => {
    console.error('Error starting the application:', err);
    process.exit(1);
});