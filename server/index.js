const express = require('express')
const routes = require('../routes');
const server = express()

server.use(express.json());
server.use('/market-status-api', routes);

module.exports = server;
