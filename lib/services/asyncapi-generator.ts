import Generator from '@asyncapi/generator';
import jsyaml from 'js-yaml';
import os from 'os';
import { AsyncApiTemplateOptions } from '../interfaces';

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
  templateConfig: Record<string, any>;
  hooks: Record<string, any>;
  templateParams: AsyncApiTemplateOptions;
  generate: (document: any) => Promise<void>;
  generateFromURL: (url: string) => Promise<void>;
  generateFromFile: (path: string) => Promise<void>;
  generateFromString: (yaml: string, args?: any) => Promise<string>;
}

export class AsyncapiGenerator {
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
