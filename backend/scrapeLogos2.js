const https = require('https');

https.get('https://rasawimanaholdings.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    const logos = [];
    while ((match = imgRegex.exec(data)) !== null) {
      logos.push(match[1]);
    }
    console.log('Images for rasawimanaholdings.com :', logos.slice(0, 20));
  });
}).on('error', err => console.log('Error fetching', err));
