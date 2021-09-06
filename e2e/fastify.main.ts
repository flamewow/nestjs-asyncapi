import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './src/app.module';
import { AsyncApiDocumentBuilder, AsyncApiModule, AsyncServerObject } from '../lib';

const port = 4001;
const host = '0.0.0.0';
const docRelPath = '/async-api';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const asyncApiServer: AsyncServerObject = {
    url: 'ws://localhost:4001',
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

  const asyncapiDocument = await AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup(docRelPath, app, asyncapiDocument);

  return app.listen(port, host);
}

const baseUrl = `http://${host}:${port}`;
const startMessage = `Server started at ${baseUrl}; AsyncApi at ${baseUrl + docRelPath};`;

bootstrap().then(() => console.log(startMessage));
