#!/bin/bash
echo "Starting Virtual Lawyer application with Claude AI..."

echo "Updating .env file..."
cp .env.new .env

echo "Starting application..."
node start.js