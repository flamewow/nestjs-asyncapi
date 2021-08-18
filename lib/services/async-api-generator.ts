import Generator from '@asyncapi/generator';
import { ContractParser } from './contract-parser';
import { AsyncApiTemplateOptions } from '../interfaces/async-api-template-options.interface';
import { Logger } from '@nestjs/common';
import os from 'os';

interface IGenerator {
  templateName: string;
  targetDir: string;
  entrypoint?: string;
  noOverwriteGlobs: string[];
  disabledHooks: { [key: string]: string | boolean | string[] };
  output: 'string' | 'fs';
  forceWrite: boolean;
  debug: boolean;
  install: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  templateConfig: object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  hooks: object;
  templateParams: AsyncApiTemplateOptions;
  generate: (document: any) => Promise<void>;
  generateFromURL: (url: string) => Promise<void>;
  generateFromFile: (path: string) => Promise<void>;
  generateFromString: (yaml: string, args?: any) => Promise<string>;
}

export class AsyncApiGenerator {
  private readonly logger = new Logger(AsyncApiGenerator.name);
  private readonly parser = new ContractParser();

  private readonly generator: IGenerator;

  constructor(readonly templateOptions?: AsyncApiTemplateOptions) {
    this.generator = new Generator('@asyncapi/html-template', os.tmpdir(), {
      forceWrite: true,
      entrypoint: 'index.html',
      output: 'string',
      templateParams: {
        singleFile: true,
        ...templateOptions,
      },
    });
  }

  public async generate(contract: any): Promise<string> {
    this.logger.log('Parsing AsyncAPI YAML from AsyncApiContract');
    const yaml = this.parser.parse(contract);
    this.logger.log('Generating yaml template to files');
    return await this.generator.generateFromString(yaml, {
      resolve: {
        file: false,
      },
    });
  }
}
