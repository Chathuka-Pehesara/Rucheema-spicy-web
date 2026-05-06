const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/users/stats', {
      headers: { Authorization: 'Bearer YOUR_TOKEN_HERE' }
    });
    console.log('Response:', res.data);
  } catch (err) {
    console.error('Error Status:', err.response?.status);
    console.error('Error Data:', err.response?.data);
  }
}
// Note: This won't work without a token, but I can check if it returns 500 even without auth if the error is in the middleware or early on.
// Actually, let's just check the server.js and routes.
