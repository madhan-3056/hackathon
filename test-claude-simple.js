// Simple test script for Claude API
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

console.log('Starting simple Claude API test...');

// Get Claude API key
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

if (!CLAUDE_API_KEY) {
  console.error('Error: Claude API key not found in environment variables');
  process.exit(1);
}

console.log('Claude API key found:', CLAUDE_API_KEY.substring(0, 10) + '...');

// Function to test Claude API with minimal request
const testClaudeAPI = async () => {
  try {
    console.log('Making request to Claude API...');
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Hello, Claude! Please respond with a simple greeting.'
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    console.log('Response received from Claude API!');
    console.log('Response content:', response.data.content[0].text);
    
    return true;
  } catch (error) {
    console.error('Error making request to Claude API:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
    
    return false;
  }
};

// Run the test
testClaudeAPI()
  .then(success => {
    if (success) {
      console.log('Claude API test successful!');
    } else {
      console.log('Claude API test failed.');
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
  });