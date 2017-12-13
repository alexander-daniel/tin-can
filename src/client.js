/*
 * Since the browser cannot use the `ws` package, we shim here and make up
 * and differences in the API further down.
 */
const IS_BROWSER = typeof(window) !== 'undefined' ? true : false;
const WebSocket = IS_BROWSER ? window.WebSocket : require('ws');

const { EventEmitter } = require('events');
const hat = require('hat');

class TinCanClient extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.generateID = hat.rack();
  }

  connect(uri = 'ws://localhost:8080') {
    return new Promise((resolve) => {
      const ws = new WebSocket(uri);
      this.ws = ws;

      if (IS_BROWSER) {
        ws.onopen = () => {
          resolve();
        }

        ws.onmessage = this.handleMessage.bind(this);
      }

      else {
        ws.on('open', () => {
          resolve();
        });

        ws.on('message', this.handleMessage.bind(this));
      }
    });
  }

  handleMessage(rawData) {

    if (IS_BROWSER) {
      rawData = rawData.data;
    }

    const { eventID, eventName, payload } = JSON.parse(rawData);


    if (eventID) {
      this.emit(eventID, payload);
    }

    else if (eventName) {
      this.emit(eventName, payload);
    }

  }

  send(eventName, payload) {
    return new Promise((resolve) => {
      const eventID = this.generateID();

      // TODO: ensure both exist and are ok, handle errors
      this.ws.send(JSON.stringify({
        eventID,
        eventName,
        payload
      }));

      this.once(eventID, (data) => {
        resolve(data);
      });
    });
  }
}

module.exports = TinCanClient;
