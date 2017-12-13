const WebSocketClient = require('../../src').Client;

const client = new WebSocketClient();

async function main() {
  await client.connect('ws://localhost:8080');
  const handshakeResult = await client.send('handshake', {
    foo: 'bar'
  });
  console.error(handshakeResult);
}

main();
