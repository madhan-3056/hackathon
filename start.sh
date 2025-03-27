#!/bin/bash

echo "===== Virtual Lawyer Startup Menu ====="
echo
echo "Choose an option:"
echo "1. Fix frontend issues and start application"
echo "2. Start application (if already fixed)"
echo "3. Start frontend only"
echo "4. Start backend only"
echo "5. Install all dependencies"
echo "6. View startup guide"
echo "7. Exit"
echo

read -p "Enter your choice (1-7): " choice

if [ "$choice" = "1" ]; then
    echo
    echo "Step 1: Fixing frontend issues..."
    cd frontend
    npm install
    npm install react-scripts --save
    cd ..
    
    echo
    echo "Step 2: Starting the application..."
    echo
    echo "The application will be available at:"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:5001"
    echo "API Documentation: http://localhost:5001/api-docs"
    echo
    echo "Press Ctrl+C to stop the application."
    echo
    
    # Open browser if xdg-open (Linux) or open (Mac) is available
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:3000 &
    elif command -v open > /dev/null; then
        open http://localhost:3000 &
    fi
    
    npm run dev:both
elif [ "$choice" = "2" ]; then
    echo
    echo "Starting the application..."
    echo
    echo "The application will be available at:"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:5001"
    echo "API Documentation: http://localhost:5001/api-docs"
    echo
    echo "Press Ctrl+C to stop the application."
    echo
    
    # Open browser if xdg-open (Linux) or open (Mac) is available
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:3000 &
    elif command -v open > /dev/null; then
        open http://localhost:3000 &
    fi
    
    npm run dev:both
elif [ "$choice" = "3" ]; then
    echo
    echo "Starting the frontend..."
    echo
    echo "The frontend will be available at:"
    echo "http://localhost:3000"
    echo
    echo "Press Ctrl+C to stop the frontend."
    echo
    
    # Open browser if xdg-open (Linux) or open (Mac) is available
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:3000 &
    elif command -v open > /dev/null; then
        open http://localhost:3000 &
    fi
    
    cd frontend
    npm start
elif [ "$choice" = "4" ]; then
    echo
    echo "Starting the backend..."
    echo
    echo "The backend will be available at:"
    echo "http://localhost:5001"
    echo "API Documentation: http://localhost:5001/api-docs"
    echo
    echo "Press Ctrl+C to stop the backend."
    echo
    
    # Open browser if xdg-open (Linux) or open (Mac) is available
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:5001 &
    elif command -v open > /dev/null; then
        open http://localhost:5001 &
    fi
    
    npm run backend
elif [ "$choice" = "5" ]; then
    echo
    echo "Installing all dependencies..."
    ./install.sh
    echo
    ./start.sh
elif [ "$choice" = "6" ]; then
    echo
    echo "Opening startup guide..."
    # Open file if xdg-open (Linux) or open (Mac) is available
    if command -v xdg-open > /dev/null; then
        xdg-open START-APP-GUIDE.md &
    elif command -v open > /dev/null; then
        open START-APP-GUIDE.md &
    else
        echo "Cannot open file automatically. Please open START-APP-GUIDE.md manually."
    fi
    echo
    read -p "Press Enter to continue..."
    ./start.sh
elif [ "$choice" = "7" ]; then
    echo
    echo "Exiting..."
    exit 0
else
    echo
    echo "Invalid choice. Please try again."
    echo
    read -p "Press Enter to continue..."
    ./start.sh
fi