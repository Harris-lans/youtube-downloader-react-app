'use strict';

const path = require('path');
const process = require('process');

const PORT = 12345 || Number.parseInt(process.env.PORT);
const FRONTEND_APPLICATION_PATH = path.join(__dirname, '../../frontend/build/index.html') || process.env.FRONTEND_APPLICATION_PATH;

module.exports = { PORT, FRONTEND_APPLICATION_PATH };
