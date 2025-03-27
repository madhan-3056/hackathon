#!/bin/bash

echo "===== Running Virtual Lawyer (Enhanced) ====="
echo
echo "This script will:"
echo "1. Install dependencies"
echo "2. Build the frontend"
echo "3. Start the enhanced server"
echo
echo "Your application will be available at: http://localhost:5001"
echo
echo "Press Enter to continue or Ctrl+C to cancel..."
read

echo
echo "Step 1: Installing dependencies..."
echo

echo "Installing backend dependencies..."
npm install

echo
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo
echo "Step 2: Building frontend..."
echo
cd frontend
npm run build
cd ..

echo
echo "Step 3: Creating necessary directories..."
echo
if [ ! -d "frontend/build" ]; then
    echo "Frontend build directory not found. Build failed."
    exit 1
fi

echo
echo "Step 4: Starting the enhanced server..."
echo
echo "Your application will be available at: http://localhost:5001"
echo "Press Ctrl+C to stop the server"
echo

# Open browser after 5 seconds
(
    sleep 5
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open http://localhost:5001
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost:5001 &> /dev/null || sensible-browser http://localhost:5001 &> /dev/null || x-www-browser http://localhost:5001 &> /dev/null || gnome-open http://localhost:5001 &> /dev/null
    fi
) &

node server-enhanced.js