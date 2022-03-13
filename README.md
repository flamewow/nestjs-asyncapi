<a href="#"><img src="https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-no-action.svg" /></a>

## Donate to support Ukraine (only verified charities)

Please opt-in for monthly payment, if possible.

- [**Come Back Alive**](https://savelife.in.ua/en/donate/) - provide support to the Ukrainian Armed Forces
- [**Sunflower of Peace**](https://www.facebook.com/donate/507886070680475/) - prepare first aid medical tactical backpacks for paramedics and doctors on the front lines
- [**Voices of Children**](https://voices.org.ua/en/) - get food, water, hygiene kits, cash, and psychosocial support to children and families
- [**Army SOS**](https://armysos.com.ua/en/) - provides food and other support to Ukrainian troops
- [**Territory of Kindness**](https://vuf-td.space/en/) - provide support to children , army , and medical-supply
- [**People In Need**](https://www.peopleinneed.net/donate/once) (select `SOS Ukraine`) - focuses on providing food, clean water, and hygienic products to those impacted by Russian aggression
- [**Ukrainian Red Cross**](https://redcross.org.ua/en/donate/) - provide humanitarian relief to Ukrainians affected by the conflict
- [**Raise Funds for Ukraine’s Armed Forces**](https://bank.gov.ua/en/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi) - special account opened by Ukrainian National Bank

## Other ways to help

- Spread the word. Add banners to your projects
- Demand severe sanctions against Russia and support for Ukraine from your leaders
- Cancel any business with Russian companies (stop supporting Russian economy, and reduce your own risks)
- Reach out to Ukrainian friends, offer help
- Get rid of Russian software, dependencies and infrastructure
- Educate yourself and others on the Russian threat, read reputable news. Check out common misbelief.
- Protest against war. **Don’t be silent**

## For foreign warriors

Foreign warriors who are willing to join the resistance can [join the International Legion of Territorial Defense](https://www.ukrinform.net/rubric-ato/3415272-how-to-join-international-legion-to-defend-ukraine-algorithm.html)

# REPOSITORY README:

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
Early beta, any contribution is welcomed.

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
