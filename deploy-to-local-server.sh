#!/bin/bash

echo "===== Deploying Virtual Lawyer to Local Server ====="
echo

read -p "Enter the path to your local server directory (e.g., /var/www/html/virtual-lawyer): " server_path

if [ ! -d "$server_path" ]; then
    echo "Creating directory $server_path..."
    mkdir -p "$server_path"
fi

echo
echo "Step 1: Building the application..."
echo

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo
echo "Step 2: Copying files to local server..."
echo

echo "Creating necessary directories..."
mkdir -p "$server_path/public"
mkdir -p "$server_path/config"
mkdir -p "$server_path/controllers"
mkdir -p "$server_path/middlewares"
mkdir -p "$server_path/models"
mkdir -p "$server_path/routes"
mkdir -p "$server_path/services"
mkdir -p "$server_path/utils"

echo "Copying frontend files..."
cp -r frontend/build/* "$server_path/public/"

echo "Copying server files..."
cp server-enhanced.js "$server_path/"
cp package.json "$server_path/"
cp .env "$server_path/"

echo "Copying application directories..."
cp -r config/* "$server_path/config/"
cp -r controllers/* "$server_path/controllers/"
cp -r middlewares/* "$server_path/middlewares/"
cp -r models/* "$server_path/models/"
cp -r routes/* "$server_path/routes/"
cp -r services/* "$server_path/services/"
cp -r utils/* "$server_path/utils/"

echo
echo "Step 3: Setting up the server..."
echo

echo "Creating start script..."
cat > "$server_path/start-server.sh" << 'EOF'
#!/bin/bash
echo "Starting Virtual Lawyer application..."
cd "$(dirname "$0")"
npm install
node server-enhanced.js
EOF

chmod +x "$server_path/start-server.sh"

echo
echo "Deployment complete!"
echo
echo "To start the application:"
echo "1. Navigate to $server_path"
echo "2. Run ./start-server.sh"
echo "3. Access the application at http://localhost:5001"
echo
read -p "Press Enter to exit..."