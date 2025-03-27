// API Configuration for frontend
const apiConfig = {
    // Base URL for API requests
    baseURL: process.env.REACT_APP_API_URL || '/api/v1',

    // Default headers
    headers: {
        'Content-Type': 'application/json'
    },

    // Timeout in milliseconds
    timeout: 30000
};

export default apiConfig;