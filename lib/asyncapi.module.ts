import {
  INestApplication,
  INestApplicationContext,
  Logger,
} from '@nestjs/common';
import { SwaggerDocumentOptions } from '@nestjs/swagger';
import { validatePath } from '@nestjs/swagger/dist/utils/validate-path.util';
import jsyaml from 'js-yaml';
import { AsyncapiScanner } from './asyncapi.scanner';
import { AsyncApiTemplateOptions } from './interfaces';
import { AsyncapiGenerator } from './services';
import { AsyncAPIObject } from './index';

export interface AsyncApiDocumentOptions extends SwaggerDocumentOptions {}

export class AsyncApiModule {
  private static readonly logger = new Logger(AsyncApiModule.name);

  public static createDocument(
    app: INestApplicationContext,
    config: Omit<AsyncAPIObject, 'channels'>,
    options: AsyncApiDocumentOptions = {},
  ): AsyncAPIObject {
    const asyncapiScanner = new AsyncapiScanner();
    const document = asyncapiScanner.scanApplication(app, options);

    document.components = {
      ...(config.components || {}),
      ...document.components,
    };

    return {
      asyncapi: '2.4.0',
      ...config,
      ...document,
    };
  }

  static async composeHtml(
    contract: AsyncAPIObject,
    templateOptions?: AsyncApiTemplateOptions,
  ) {
    const generator = new AsyncapiGenerator(templateOptions);
    return await generator.generate(contract).catch((e) => {
      this.logger.error(e);
      throw e;
    });
  }

  public static async setup(
    path: string,
    app: INestApplication,
    document: AsyncAPIObject,
    templateOptions?: AsyncApiTemplateOptions,
  ) {
    const httpAdapter = app.getHttpAdapter();
    const finalPath = validatePath(path);

    const html = await this.composeHtml(document, templateOptions);
    const yamlDocument = jsyaml.dump(document);
    const jsonDocument = JSON.stringify(document);

    httpAdapter.get(finalPath, (req, res) => {
      res.type('text/html');
      res.send(html);
    });

    httpAdapter.get(finalPath + '-json', (req, res) => {
      res.type('application/json');
      res.send(jsonDocument);
    });

    httpAdapter.get(finalPath + '-yaml', (req, res) => {
      res.type('text/yaml');
      res.send(yamlDocument);
    });
  }
}
