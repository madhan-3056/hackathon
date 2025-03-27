#!/bin/bash

echo "===== Installing Virtual Lawyer Dependencies ====="
echo

echo "Step 1: Installing backend dependencies..."
npm install

echo
echo "Step 2: Installing frontend dependencies..."
cd frontend
npm install
npm install react-scripts --save
cd ..

echo
echo "===== All dependencies installed successfully! ====="
echo
echo "You can now start the application using:"
echo "./start.sh"
echo