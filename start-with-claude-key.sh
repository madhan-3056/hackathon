#!/bin/bash
echo "Starting Virtual Lawyer application with Claude AI..."

echo "Updating .env file with Claude API key..."
cp .env.claude .env

echo "Starting application..."
node start.js