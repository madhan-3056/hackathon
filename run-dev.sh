#!/bin/bash

echo "===== Virtual Lawyer Development Environment ====="
echo

function show_menu {
  echo "Choose an option:"
  echo "1. Start application (standard)"
  echo "2. Start application with auto-reload (nodemon)"
  echo "3. Start application with debugging enabled"
  echo "4. Build frontend"
  echo "5. Run database check"
  echo "6. Test API endpoints"
  echo "7. Open application in browser"
  echo "8. Exit"
  echo
}

function start_standard {
  echo
  echo "Starting application in standard mode..."
  echo
  echo "Your application will be available at: http://localhost:5001"
  echo "Press Ctrl+C to stop the server"
  echo
  node server-enhanced.js
}

function start_nodemon {
  echo
  echo "Checking if nodemon is installed..."
  if ! command -v nodemon &> /dev/null; then
    echo "Nodemon is not installed. Installing now..."
    npm install -g nodemon
  fi

  echo
  echo "Starting application with auto-reload (nodemon)..."
  echo
  echo "Your application will be available at: http://localhost:5001"
  echo "The server will automatically reload when you make changes"
  echo "Press Ctrl+C to stop the server"
  echo
  nodemon server-enhanced.js
}

function start_debug {
  echo
  echo "Starting application with debugging enabled..."
  echo
  echo "Your application will be available at: http://localhost:5001"
  echo "Debugger is listening on port 9229"
  echo "To connect, open Chrome and go to chrome://inspect"
  echo "Press Ctrl+C to stop the server"
  echo
  node --inspect server-enhanced.js
}

function build_frontend {
  echo
  echo "Building frontend..."
  echo
  cd frontend
  npm install
  npm run build
  cd ..
  echo
  echo "Frontend build complete."
  echo
  read -p "Press Enter to continue..."
}

function check_db {
  echo
  echo "Checking database connection..."
  echo
  node -e "const mongoose = require('mongoose'); require('dotenv').config(); const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual_lawyer'; mongoose.connect(uri).then(() => { console.log('Connected to MongoDB successfully!'); mongoose.connection.close(); }).catch(err => { console.error('Failed to connect to MongoDB:', err.message); });"
  echo
  read -p "Press Enter to continue..."
}

function test_api {
  echo
  echo "Testing API endpoints..."
  echo
  node test-api.js
  echo
  read -p "Press Enter to continue..."
}

function open_browser {
  echo
  echo "Opening application in browser..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:5001
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:5001 &> /dev/null || sensible-browser http://localhost:5001 &> /dev/null || x-www-browser http://localhost:5001 &> /dev/null || gnome-open http://localhost:5001 &> /dev/null
  else
    echo "Could not open browser automatically. Please open http://localhost:5001 manually."
  fi
}

# Main menu loop
while true; do
  show_menu
  read -p "Enter option (1-8): " option
  
  case $option in
    1) start_standard; break ;;
    2) start_nodemon; break ;;
    3) start_debug; break ;;
    4) build_frontend ;;
    5) check_db ;;
    6) test_api ;;
    7) open_browser ;;
    8) echo -e "\nExiting..."; exit 0 ;;
    *) echo -e "\nInvalid option. Please try again." ;;
  esac
done