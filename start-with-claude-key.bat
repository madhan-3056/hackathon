@echo off
echo Starting Virtual Lawyer application with Claude AI...

echo Updating .env file with Claude API key...
copy /Y .env.claude .env

echo Starting application...
node start.js
pause