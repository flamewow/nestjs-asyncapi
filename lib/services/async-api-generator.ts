import Generator from '@asyncapi/generator';
import { AsyncApiTemplateOptions } from '../interfaces';
import { Logger } from '@nestjs/common';
import jsyaml from 'js-yaml';
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
    const yaml = jsyaml.dump(contract);
    return await this.generator.generateFromString(yaml, {
      resolve: {
        file: false,
      },
    });
  }
}
