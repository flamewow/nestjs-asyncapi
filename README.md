[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

<a href="https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md" target="blank"><img src="https://github.com/flamewow/nestjs-asyncapi/blob/main/misc/ua.png" alt="#StandWithUkraine" /></a>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[AsyncApi](https://www.asyncapi.com/) module for [Nest](https://github.com/nestjs/nest).

The idea is to generate [AsyncApi](https://www.asyncapi.com/) documentation (for event-based services like websockets) similar to [nestjs/swagger](https://github.com/nestjs/swagger).

[Documentation example](https://playground.asyncapi.io/?load=https://raw.githubusercontent.com/asyncapi/asyncapi/v2.1.0/examples/simple.yml)

Current state: package can generate [AsyncApi](https://www.asyncapi.com/) contract document and serve html (similar to swagger-ui).

## Installation

full installation

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
