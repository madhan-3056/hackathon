// API Configuration for frontend
const apiConfig = {
    // Base URL for API requests
    baseURL: process.env.REACT_APP_API_URL || '/api/v1',

    // Default headers
    headers: {
        'Content-Type': 'application/json'
    },

    // Timeout in milliseconds
    timeout: 30000,

    // Claude API configuration
    claude: {
        // The frontend will use this endpoint to communicate with Claude via the backend
        endpoint: '/ai/chat',

        // Default model to use
        model: 'claude-3-haiku-20240307',

        // Default parameters
        defaultParams: {
            temperature: 0.3,
            max_tokens: 1000
        }
    }
};

export default apiConfig;