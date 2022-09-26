[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

<a href="https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md" target="blank"><img src="https://github.com/flamewow/nestjs-asyncapi/blob/main/misc/ua.png" alt="#StandWithUkraine" /></a>

## Description

[AsyncApi](https://www.asyncapi.com/) module for [Nest](https://github.com/nestjs/nest).

Generate [AsyncApi](https://www.asyncapi.com/) documentation (for event-based services, like websockets) in a similar to [nestjs/swagger](https://github.com/nestjs/swagger) fashion.

[Documentation example](https://playground.asyncapi.io/?load=https://raw.githubusercontent.com/asyncapi/asyncapi/v2.1.0/examples/simple.yml)

## Installation

full installation (with chromium)

```bash
$ npm i --save nestjs-asyncapi
```

nestjs-async api package doesn't require chromium (which is required by asyncapi lib), so u can skip chromium installation by setting PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true environment variable.
```bash
$ PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm i --save nestjs-asyncapi
```

## Quick Start

Document is composed via decorators.

Define [AsyncApi](https://www.asyncapi.com/) service class by AsyncApiService decorator <br/>
```typescript
  @AsyncApiService()
```

Define publish/subscribe methods by AsyncApiPub/AsyncApiSub decorators
```typescript
  class AnySwaggerExampleDto {
    @ApiProperty()
    readonly name: string;
  }

  @AsyncApiPub({
    channel: 'test',
    summary: 'Send test packet',
    description: 'method is used for test purposes',
    message: {
      name: 'test data',
      payload: {
        type: AnySwaggerExampleDto,
      },
    },
  })

  @AsyncApiSub({
    channel: 'signal',
    summary: 'Subscribe to signal packet',
    description: 'method is used for test purposes',
    message: {
      name: 'test data signal',
      payload: {
        type: AnySwaggerExampleDto,
      },
    },
  })
```

### Usage example:

gateway file:
```typescript
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io-client';
import { AsyncApiPub, AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi';

@AsyncApiService()
@WebSocketGateway({ transports: ['websocket'], namespace: 'cats-ws' })
export class CatsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger(CatsGateway.name);

  afterInit(nsp: Namespace) {
    this.logger.log(`WS server init: ${nsp?.name}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`IOClient disconnected: ${client.id}`);
  }

  @SubscribeMessage('test')
  @AsyncApiPub({
    channel: 'test',
    summary: 'Send test packet',
    description: 'method is used for test purposes',
    message: {
      name: 'test data',
      payload: {
        type: AnySwaggerExampleDto,
      },
    },
  })
  test(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    this.logger.log(`data from client ${client.id} : ${JSON.stringify(data)}`);
    this.server.emit('test', data);
  }

  @AsyncApiSub({
    channel: 'signal',
    summary: 'Subscribe to signal packet',
    description: 'method is used for test purposes',
    message: {
      name: 'test data signal',
      payload: {
        type: AnySwaggerExampleDto,
      },
    },
  })
  async emitSignal(boardUUID: string, data: Record<string, any>) {
    this.server.to('test').emit('signal', data);
  }
}

```

main file:
```typescript
import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';
import { AsyncApiDocumentBuilder, AsyncApiModule, AsyncServerObject } from 'nestjs-asyncapi';

const port = 4001;
const host = '0.0.0.0';
const docRelPath = '/async-api';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
```
