import { SwaggerDocumentOptions } from '@nestjs/swagger';

import { AsyncAPIObject, FASTIFY } from './index';
import { AsyncapiScanner } from './asyncapi.scanner';
import { INestApplication, Logger } from '@nestjs/common';
import { AsyncapiGenerator } from './services';
import { validatePath } from '@nestjs/swagger/dist/utils/validate-path.util';
import { AsyncApiTemplateOptions } from './interfaces';
import jsyaml from 'js-yaml';

export interface AsyncApiDocumentOptions extends SwaggerDocumentOptions {}

export class AsyncApiModule {
  private static readonly logger = new Logger(AsyncApiModule.name);

  public static async setup(path: string, app: INestApplication, document: AsyncAPIObject, templateOptions?: AsyncApiTemplateOptions) {
    const httpAdapter = app.getHttpAdapter();
    if (httpAdapter && httpAdapter.getType() === FASTIFY) {
      return this.setupFastify(path, app, document, templateOptions);
    }

    return this.setupExpress(path, app, document, templateOptions);
  }

  public static createDocument(
    app: INestApplication,
    config: Omit<AsyncAPIObject, 'channels'>,
    options: AsyncApiDocumentOptions = {},
  ): AsyncAPIObject {
    const asyncapiScanner = new AsyncapiScanner();
    const document = asyncapiScanner.scanApplication(app, options);

    document.components = { ...(config.components || {}), ...document.components };

    return {
      asyncapi: '2.1.0',
      ...config,
      ...document,
    };
  }

  static async composeHtml(contract: AsyncAPIObject, templateOptions?: AsyncApiTemplateOptions) {
    const generator = new AsyncapiGenerator(templateOptions);
    return await generator.generate(contract).catch((e) => {
      this.logger.error(e);
      throw e;
    });
  }

  private static async setupExpress(path: string, app: INestApplication, document: AsyncAPIObject, templateOptions?: AsyncApiTemplateOptions) {
    const httpAdapter = app.getHttpAdapter();
    const finalPath = validatePath(path);

    const html = await this.composeHtml(document, templateOptions);

    const yamlDocument = jsyaml.dump(document);

    httpAdapter.get(finalPath, (req, res) => res.send(html));
    httpAdapter.get(finalPath + '-json', (req, res) => {
      res.type('.json');
      res.send(document);
    });
    httpAdapter.get(finalPath + '-yaml', (req, res) => {
      res.type('.yaml');
      res.send(yamlDocument);
    });
  }

  private static async setupFastify(path: string, app: INestApplication, document: AsyncAPIObject, templateOptions?: AsyncApiTemplateOptions) {
    throw Error('fastify is not supported yet, but will be added later. ');
    // toDo: add fastify support
  }
}
