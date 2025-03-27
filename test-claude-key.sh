#!/bin/bash
echo "Testing Claude AI API integration with the provided key..."

echo "Updating .env file with Claude API key..."
cp .env.claude .env

echo "Running test..."
node test-claude.js