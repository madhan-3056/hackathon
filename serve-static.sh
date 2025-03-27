#!/bin/bash

echo "===== Serving Static Frontend ====="
echo
echo "This script will:"
echo "1. Build the frontend (if needed)"
echo "2. Start a simple static server"
echo
echo "Note: This will only serve the frontend. API calls will not work."
echo
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo
echo "Step 1: Checking frontend build..."
echo

if [ ! -d "frontend/build" ]; then
    echo "Frontend build not found. Building now..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "Frontend build found."
fi

echo
echo "Step 2: Starting static server..."
echo
echo "Your static frontend will be available at: http://localhost:8080"
echo "Press Ctrl+C to stop the server"
echo

# Open browser after 3 seconds
(
    sleep 3
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open http://localhost:8080
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost:8080 &> /dev/null || sensible-browser http://localhost:8080 &> /dev/null || x-www-browser http://localhost:8080 &> /dev/null || gnome-open http://localhost:8080 &> /dev/null
    fi
) &

node serve-static.js