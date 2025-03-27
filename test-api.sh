#!/bin/bash

echo "===== Testing API Endpoints ====="
echo
echo "This script will test the API endpoints of your application."
echo "Make sure your server is running before executing this script."
echo
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo
echo "Testing API endpoints..."
echo

echo "Trying to run with ESM (test-api.js)..."
node test-api.js

if [ $? -ne 0 ]; then
    echo
    echo "ESM version failed. Trying CommonJS version (test-api.cjs)..."
    echo
    node test-api.cjs
fi

echo
read -p "Press Enter to exit..."