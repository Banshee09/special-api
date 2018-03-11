const constants = require("./constants")

const http = require('http');
const app = require('./app');

console.log(constants.API_PORT);

const port =  process.env.PORT || constants.API_PORT;

const server = http.createServer(app);

server.listen(port);