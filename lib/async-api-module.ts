import { INestApplication, Logger } from '@nestjs/common';
import { AsyncApiContract } from './interfaces/async-api-contract.interface';
import { AsyncApiGenerator } from './services/async-api-generator';
import { AsyncApiTemplateOptions } from './interfaces/async-api-template-options.interface';
import { ContractParser } from './services/contract-parser';
import { validatePath } from '@nestjs/swagger/dist/utils/validate-path.util';

export class AsyncApiModule {
  private readonly logger = new Logger(AsyncApiModule.name);

  public static async setup(path: string, app: INestApplication, contact: any, templateOptions?: AsyncApiTemplateOptions) {
    return this.setupExpress(path, app, contact, templateOptions);
  }

  static async build(contract: AsyncApiContract, templateOptions?: AsyncApiTemplateOptions) {
    const generator = new AsyncApiGenerator(templateOptions);
    const html = await generator.generate(contract).catch((e) => {
      console.error(e);
      throw e;
    });

    return html;
  }

  private static async setupExpress(path: string, app: INestApplication, contract: AsyncApiContract, templateOptions?: AsyncApiTemplateOptions) {
    const httpAdapter = app.getHttpAdapter();
    const finalPath = validatePath(path);

    const html = await this.build(contract, templateOptions);

    const parser = new ContractParser();

    httpAdapter.get(finalPath, (req, res) => res.send(html));
    httpAdapter.get(finalPath + '-json', (req, res) => res.json(contract));
    httpAdapter.get(finalPath + '-yml', (req, res) => res.json(parser.parse(contract)));
  }
}
