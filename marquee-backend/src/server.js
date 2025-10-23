require('dotenv').config();
const http = require('http');
const app = require('./app');

const port = Number(process.env.PORT || 8080);
http.createServer(app).listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});