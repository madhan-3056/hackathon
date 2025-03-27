@echo off
echo Updating .env file...
copy /Y .env.new .env
echo .env file updated successfully!
echo.
echo The application now uses Claude AI API instead of OpenAI.
echo To use Claude AI API, sign up at https://console.anthropic.com/ and get an API key.
echo Add your API key to the .env file: CLAUDE_API_KEY=your_claude_api_key_here
echo.
echo If you don't have an API key, the application will use mock data for AI features.
pause