@echo off
echo Testing Claude AI API integration with the provided key...

echo Updating .env file with Claude API key...
copy /Y .env.claude .env

echo Running test...
node test-claude.js
pause