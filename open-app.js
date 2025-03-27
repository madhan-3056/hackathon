const { exec } = require('child_process');
const { spawn } = require('child_process');
const http = require('http');

// Function to check if server is running
function checkServerRunning(port, callback) {
    const options = {
        host: 'localhost',
        port: port,
        path: '/status',
        timeout: 1000
    };

    const req = http.get(options, (res) => {
        if (res.statusCode === 200) {
            callback(true);
        } else {
            callback(false);
        }
    });

    req.on('error', () => {
        callback(false);
    });
}

// Function to open browser
function openBrowser(url) {
    console.log(`Opening ${url} in your browser...`);

    const start = process.platform === 'win32' ? 'start' :
        process.platform === 'darwin' ? 'open' : 'xdg-open';

    exec(`${start} ${url}`, (error) => {
        if (error) {
            console.error(`Failed to open browser: ${error.message}`);
            console.log(`Please manually open ${url} in your browser.`);
        }
    });
}

// Check if server is already running
checkServerRunning(5001, (isRunning) => {
    if (isRunning) {
        console.log('Server is already running.');
        openBrowser('http://localhost:5001');
    } else {
        console.log('Server is not running. Starting server...');

        // Start the server
        const server = spawn('node', ['server-enhanced.js'], {
            stdio: 'inherit'
        });

        // Check every second if the server is up
        const interval = setInterval(() => {
            checkServerRunning(5001, (isRunning) => {
                if (isRunning) {
                    clearInterval(interval);
                    console.log('Server is now running.');

                    // Wait a bit more to make sure everything is loaded
                    setTimeout(() => {
                        openBrowser('http://localhost:5001');
                    }, 2000);
                }
            });
        }, 1000);

        // Handle server process exit
        server.on('exit', (code) => {
            clearInterval(interval);
            console.log(`Server process exited with code ${code}`);
        });
    }
});