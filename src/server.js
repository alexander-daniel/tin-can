const WebSocket = require('ws');
const { EventEmitter } = require('events')

class TinCanServer extends EventEmitter {

  listen(port = 8080) {
    const wss = new WebSocket.Server({ port });
    this.wss = wss;
    wss.on('connection', this.handleConnection.bind(this));
  }

  handleConnection(rawSocket) {

    const upgradedSocket = new EventEmitter;

    // Everytime we have a message from the raw socket, parse it and pass
    // the event to the upgraded socket that is exposed to the user.
    rawSocket.on('message', (rawData) => {
      const { eventID, eventName, payload } = JSON.parse(rawData);

      upgradedSocket.emit(eventName, payload, (err, data) => {

        // If callback is fired, send back result
        rawSocket.send(JSON.stringify({
          eventID,
          payload: data
        }));
      });

    });

    // Attach a method to the TinCanSocket instance so that you can call
    // .send(eventName, payload) with it. It will stringify and pass
    // that event back up the wire to the raw socket.
    upgradedSocket.send = (eventName, payload) => {
      rawSocket.send(JSON.stringify({
        eventName,
        payload
      }));
    };

    this.emit('connection', upgradedSocket);
  }
}

module.exports = TinCanServer;
