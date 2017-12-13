## tin-can, a simple websocket server and client wrapper

tin-can is a simple wrapper around `'ws'`, exposing a simple API to get started on websocket apps quickly.
Probably wouldn't use it for production.

Since the `'ws'` package does not support the browser, `tin-can` shims it and uses the windows `WebSocket` if you use this in a browser. That means you can use the client module in either `node` or the browser! (works with webpack)

## usage
### server
```js
const { Server } = require('../src');
const wsServer = new Server();
wsServer.listen(8080);

wsServer.on('connection', (socket) => {

  socket.on('someEvent', (data) => {
    // Do something with data here
  });

  // Callback is optional, but allows the client to wait for server awknowledgement of sent events!
  socket.on('handshake', (data, callback) => {
    // Do some work ...
    callback(null, { auth: true });
  });
})
```

### client (with `aysnc/await`)
```js
const WebSocketClient = require('../src').Client;

const client = new WebSocketClient();

async function main() {
  await client.connect('ws://localhost:8080');

  // Send a plain event down the pipe to the server.
  socket.send('someEvent', { foo: 'bar' });

  // Wait for callback
  const handshakeResult = await client.send('handshake', {
    foo: 'bar'
  });

  console.error(handshakeResult); // { auth: true }
}

main();
```

### client (with `Promises`)
```js
const WebSocketClient = require('../src').Client;

const client = new WebSocketClient();
client.connect('ws://localhost:8080').then(() => {
  // Send a plain event down the pipe to the server.
  socket.send('someEvent', { foo: 'bar' });
  client.send('handshake', { foo: 'bar' }).then((handshakeResult) => {
    console.error(handshakeResult);
  });
});
```


### usage with webpack
**Note: if using `webpack`, make sure to shim out the `ws` module by adding it to your `externals`**
```js
const path = require('path');

module.exports = {
  entry: './client.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js'
  },
  externals: {
    ws: "{}"
  }
};
```
