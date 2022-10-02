import { INestApplicationContext } from '@nestjs/common';
import { HOST, PORT, SERVER } from './constants';
import {
  AsyncApiDocumentBuilder,
  AsyncApiModule,
  AsyncAPIObject,
  AsyncServerObject,
} from '#lib';

export async function makeAsyncapiDocument(
  app: INestApplicationContext,
): Promise<AsyncAPIObject> {
  const asyncApiServer: AsyncServerObject = {
    url: `ws://${HOST}:${PORT}`,
    protocol: 'socket.io',
    protocolVersion: '4',
    description:
      'Allows you to connect using the websocket protocol to our Socket.io server.',
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
    .addServer(SERVER.maineCoon, asyncApiServer)
    .addServer(SERVER.british, asyncApiServer)
    .addServer(SERVER.persian, asyncApiServer)
    .build();

  return AsyncApiModule.createDocument(app, asyncApiOptions);
}
