const http = require('http');
const app = require('./app');
const config = require('./config.json');
const port = process.env.PORT || config.port;
const server = http.createServer(app);

server.listen(port);