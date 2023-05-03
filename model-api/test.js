const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/chatbot',
  method: 'GET',
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    const response = JSON.parse(data).response;
    console.log(response);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
