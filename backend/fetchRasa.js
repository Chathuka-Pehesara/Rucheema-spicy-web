const https = require('https');

const options = {
  hostname: 'rasawimanaholdings.com',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    require('fs').writeFileSync('rasawimana.html', data);
    console.log('Saved to rasawimana.html');
  });
}).on('error', err => console.log('Error fetching', err));
