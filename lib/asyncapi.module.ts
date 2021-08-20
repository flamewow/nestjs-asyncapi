import { SwaggerDocumentOptions } from '@nestjs/swagger';

import { AsyncApiDocumentBuilder, AsyncAPIObject, AsyncServerObject } from './index';
import { AsyncapiScanner } from './asyncapi.scanner';
import { INestApplication, Logger } from '@nestjs/common';
import { AsyncApiGenerator } from './services/async-api-generator';
import { ContractParser } from './services/contract-parser';
import { validatePath } from '@nestjs/swagger/dist/utils/validate-path.util';
import { AsyncApiTemplateOptions } from '@lib/interfaces/async-api-template-options.interface';

export interface AsyncApiDocumentOptions extends SwaggerDocumentOptions {}

export class AsyncApiModule {
  private readonly logger = new Logger(AsyncApiModule.name);

  public static createDocument(
    app: INestApplication,
    config: Omit<AsyncAPIObject, 'channels'>,
    options: AsyncApiDocumentOptions = {},
  ): AsyncAPIObject {
    const swaggerScanner = new AsyncapiScanner();
    const document = swaggerScanner.scanApplication(app, options);
    document.components = {
      ...(config.components || {}),
      ...document.components,
    };
    return {
      asyncapi: '2.1.0',
      ...config,
      ...document,
    };
  }

  public static async setup(path: string, app: INestApplication, templateOptions?: AsyncApiTemplateOptions) {
    return this.setupExpress(path, app, templateOptions);
  }

  static async scan(app: INestApplication): Promise<AsyncAPIObject> {
    const asyncApiServer: AsyncServerObject = {
      url: 'server.p-url:{port}',
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
      .setTitle('Cats example')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .setDefaultContentType('application/json')
      .addSecurity('user-password', { type: 'userPassword' })
      .addServer('cats-server', asyncApiServer)
      .build();

    const extraModels = [];
    const asyncapiExtraModels = [];

    const asyncApiDocument = AsyncApiModule.createDocument(app, asyncApiOptions, { extraModels: [...extraModels, ...asyncapiExtraModels] });
    return asyncApiDocument;
  }

  static async build(contract: AsyncAPIObject, templateOptions?: AsyncApiTemplateOptions) {
    const generator = new AsyncApiGenerator(templateOptions);
    const html = await generator.generate(contract).catch((e) => {
      console.error(e);
      throw e;
    });

    return html;
  }

  private static async setupExpress(path: string, app: INestApplication, templateOptions?: AsyncApiTemplateOptions) {
    const httpAdapter = app.getHttpAdapter();
    const finalPath = validatePath(path);

    const contract = await this.scan(app);
    const html = await this.build(contract, templateOptions);

    const parser = new ContractParser();

    httpAdapter.get(finalPath, (req, res) => res.send(html));
    httpAdapter.get(finalPath + '-json', (req, res) => res.json(contract));
    httpAdapter.get(finalPath + '-yml', (req, res) => res.json(parser.parse(contract)));
  }
}
