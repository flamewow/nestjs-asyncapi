import { INestApplicationContext } from '@nestjs/common';
import { AsyncApiDocumentBuilder, AsyncApiModule, AsyncServerObject } from '../lib';
import { HOST, PORT } from './constants';

export async function makeAsyncapiDocument(app: INestApplicationContext) {
  const asyncApiServer: AsyncServerObject = {
    url: `ws://${HOST}:${PORT}`,
    protocol: 'socket.io',
    protocolVersion: '4',
    description: 'Allows you to connect using the websocket protocol to our Socket.io server.',
    security: [{ 'user-password': [] }],
    variables: {
      port: {
        description: 'Secure connection (TLS) is available through port 443.',
        default: '443',
      },
    },
    bindings: {},
  };

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Cats SocketIO')
    .setDescription('Cats SocketIO description here')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addSecurity('user-password', { type: 'userPassword' })
    .addServer('cats-server', asyncApiServer)
    .build();

  return AsyncApiModule.createDocument(app, asyncApiOptions);
}
