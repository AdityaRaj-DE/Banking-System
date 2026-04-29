import http from 'http';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/accounts/customer/1/stats',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <REPLACE_WITH_ACTUAL_TOKEN_IF_POSSIBLE>'
  }
};

// This will likely fail with 401/403 because of the token, but it will check if the route exists and the server doesn't crash.
const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
