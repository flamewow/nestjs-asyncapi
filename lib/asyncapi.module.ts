import {
  INestApplication,
  INestApplicationContext,
  Logger,
} from '@nestjs/common';
import { validatePath } from '@nestjs/swagger/dist/utils/validate-path.util';
import jsyaml from 'js-yaml';
import {
  AsyncApiDocument,
  AsyncApiDocumentOptions,
  AsyncApiTemplateOptions,
} from './interface';
import { AsyncapiGenerator, AsyncapiScanner } from './services';

export class AsyncApiModule {
  private static readonly logger = new Logger(AsyncApiModule.name);

  public static createDocument(
    app: INestApplicationContext,
    config: Omit<AsyncApiDocument, 'channels'>,
    options: AsyncApiDocumentOptions = {},
  ): AsyncApiDocument {
    const asyncapiScanner = new AsyncapiScanner();
    const document = asyncapiScanner.scanApplication(app, options);

    document.components = {
      ...(config.components || {}),
      ...document.components,
    };

    return {
      ...config,
      ...document,
    };
  }

  static async composeHtml(
    contract: AsyncApiDocument,
    templateOptions?: AsyncApiTemplateOptions,
  ) {
    const generator = new AsyncapiGenerator(templateOptions);
    return generator.generate(contract).catch((err) => {
      this.logger.error(err);
      throw err;
    });
  }

  public static async setup(
    path: string,
    app: INestApplication,
    document: AsyncApiDocument,
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
