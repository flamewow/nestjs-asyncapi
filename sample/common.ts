import { INestApplicationContext } from '@nestjs/common';
import { HOST, PORT, SERVER } from './constants';
import { Cat, Feline, Lion, Tiger } from './felines/class';
import { FelinesModule } from './felines/felines.module';
import {
  AsyncApiDocument,
  AsyncApiDocumentBuilder,
  AsyncApiModule,
  AsyncServerObject,
} from '#lib';

export async function makeAsyncapiDocument(
  app: INestApplicationContext,
): Promise<AsyncApiDocument> {
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

  const servers = Object.keys(SERVER).map((i) => ({
    name: SERVER[i],
    server: asyncApiServer,
  }));

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Feline')
    .setDescription('Feline server description here')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addSecurity('user-password', { type: 'userPassword' })
    .addServers(servers)
    .build();

  return AsyncApiModule.createDocument(app, asyncApiOptions, {
    include: [FelinesModule],
    extraModels: [Cat, Lion, Tiger, Feline],
  });
}
