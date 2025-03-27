#!/bin/bash

echo "===== Virtual Lawyer Frontend Fix ====="
echo "This script will fix the 'react-scripts' not recognized error."

echo
echo "Step 1: Navigating to the frontend directory..."
cd frontend

echo
echo "Step 2: Installing frontend dependencies..."
npm install

echo
echo "Step 3: Installing react-scripts specifically..."
npm install react-scripts --save

echo
echo "Step 4: Verifying installation..."
npx react-scripts --version
if [ $? -ne 0 ]; then
    echo "Error: react-scripts installation failed."
    echo "Please try running the following commands manually:"
    echo "cd frontend"
    echo "npm install"
    echo "npm install react-scripts --save"
else
    echo "react-scripts installed successfully!"
fi

echo
echo "===== Frontend Fix Complete ====="
echo
echo "To start the frontend, run:"
echo "cd frontend"
echo "npm start"
echo
echo "To start the entire application, run:"
echo "npm run dev:both"
echo
echo "Your application will be available at:"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5001"
echo