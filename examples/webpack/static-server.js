'use strict';

const http = require('http');

const ecstatic = require('ecstatic')({
  root: `${__dirname}`,
  showDir: true,
  autoIndex: true,
});

http.createServer(ecstatic).listen(8000);

console.log('Static Server Listening on :8000');
