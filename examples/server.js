const { Server } = require('../src');
const wsServer = new Server();
wsServer.listen(8080);

wsServer.on('connection', (socket) => {
  socket.on('handshake', (data, callback) => {
    // setTimeout(() => {
      callback(null, { auth: true });
    // }, 5000);
  });
})
