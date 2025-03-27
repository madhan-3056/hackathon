#!/bin/bash

echo "===== Building Virtual Lawyer for Deployment ====="
echo

echo "Step 1: Installing backend dependencies..."
npm install

echo
echo "Step 2: Installing frontend dependencies..."
cd frontend
npm install
npm install react-scripts --save

echo
echo "Step 3: Building frontend..."
npm run build
cd ..

echo
echo "Step 4: Copying frontend build to backend..."
if [ ! -d "frontend/build" ]; then
    echo "Error: Frontend build directory not found."
    echo "Please make sure the frontend build was successful."
    exit 1
fi

mkdir -p frontend/build

echo "Copying files..."
cp -R frontend/build/* frontend/build/

echo
echo "===== Build Complete ====="
echo
echo "The application is now ready for deployment."
echo "To deploy to a live server, run:"
echo "./deploy-live.sh your-server-ip your-username your-ssh-port your-domain.com"
echo