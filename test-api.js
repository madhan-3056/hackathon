const axios = require('axios');

async function testEndpoints() {
    try {
        console.log('Testing API endpoints...');
        console.log('-------------------------');

        // Test health endpoint
        console.log('Testing health endpoint...');
        const health = await axios.get('http://localhost:5001/api/v1/health');
        console.log('Health check:', health.data);
        console.log('-------------------------');

        // Test status endpoint
        console.log('Testing status endpoint...');
        const status = await axios.get('http://localhost:5001/status');
        console.log('Status check:', status.data.status);
        console.log('Server uptime:', Math.floor(status.data.uptime / 60), 'minutes');
        console.log('Server memory usage:', Math.round(status.data.memory.heapUsed / 1024 / 1024), 'MB');
        console.log('-------------------------');

        // Try to test auth endpoints
        console.log('Testing auth endpoints...');
        try {
            // This will likely fail if no user exists, but it tests the endpoint availability
            await axios.post('http://localhost:5001/api/v1/auth/login', {
                email: 'test@example.com',
                password: 'password123'
            });
            console.log('Auth endpoint is available (login attempt made)');
        } catch (authError) {
            if (authError.response && authError.response.status) {
                console.log('Auth endpoint is available (returned status:', authError.response.status + ')');
            } else {
                console.error('Auth endpoint error:', authError.message);
            }
        }
        console.log('-------------------------');

        console.log('All tests completed!');
    } catch (error) {
        console.error('API test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Is the server running?');
        } else {
            console.error('Error:', error.message);
        }
    }
}

testEndpoints();