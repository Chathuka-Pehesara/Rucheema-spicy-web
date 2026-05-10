const https = require('https');

function fetchLogos(url) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
      let match;
      const logos = [];
      while ((match = imgRegex.exec(data)) !== null) {
        if (match[1].toLowerCase().includes('logo') || match[0].toLowerCase().includes('logo')) {
          logos.push(match[1]);
        }
      }
      console.log('Logos for', url, ':', logos);
    });
  }).on('error', err => console.log('Error fetching', url, err));
}

fetchLogos('https://rasawimanaholdings.com/');
fetchLogos('https://www.sobacaterers.lk/');
