## Description

[AsyncApi](https://www.asyncapi.com/) module for [Nest](https://github.com/nestjs/nest).

Generate [AsyncApi](https://www.asyncapi.com/) documentation (for event-based services, like websockets) in a similar
to [nestjs/swagger](https://github.com/nestjs/swagger) fashion.

### [Live Preview](https://flamewow.github.io/nestjs-asyncapi/live-preview)

[AsyncApi playground](https://playground.asyncapi.io/?load=https://raw.githubusercontent.com/asyncapi/asyncapi/v2.1.0/examples/simple.yml)

## Installation

full installation (with chromium)

```bash
$ npm i --save nestjs-asyncapi
```

nestjs-async api package doesn't require chromium (which is required by asyncapi lib), so u can skip chromium
installation by setting PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true environment variable.

```bash
$ PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm i --save nestjs-asyncapi
```

## Quick Start

Include AsyncApi initialization into your bootstrap function.

```typescript
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const asyncApiOptions = new AsyncApiDocumentBuilder()
        .setTitle('Feline')
        .setDescription('Feline server description here')
        .setVersion('1.0')
        .setDefaultContentType('application/json')
        .addSecurity('user-password', {type: 'userPassword'})
        .addServer('feline-ws', {
            url: 'ws://localhost:3000',
            protocol: 'socket.io',
        })
        .build();

    const asyncapiDocument = await AsyncApiModule.createDocument(app, asyncApiOptions);
    await AsyncApiModule.setup(docRelPath, app, asyncapiDocument);

    // other bootstrap procedures here

    return app.listen(3000);
}
```

AsyncApi module explores `Controllers` & `WebSocketGateway` by default.
In most cases you won't need to add extra annotation,
but if you need to define asyncApi operations in a class that's not a controller or gateway use the `AsyncApi` class
decorator.

Mark pub/sub methods via `AsyncApiPub` or `AsyncApiSub` decorators<br/>

```typescript
class CreateFelineDto {
    @ApiProperty()
    demo: string;
}

@Controller()
class DemoController {
    @AsyncApiPub({
        channel: 'create/feline',
        message: {
            payload: CreateFelineDto
        },
    })
    async createFeline() {
        // logic here
    }

    @AsyncApiSub({
        channel: 'create/feline',
        message: {
            payload: CreateFelineDto
        },
    })
    async createFeline() {
        // logic here
    }
}

```

For more detailed examples please check out https://github.com/flamewow/nestjs-asyncapi/tree/main/sample sample app.

<h5>Do you use this library and like it? Don't be shy to give it a star
on <a href="https://github.com/flamewow/nestjs-asyncapi">github <span>★</span></a></h3>
