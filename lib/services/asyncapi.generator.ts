import Generator from '@asyncapi/generator';
import fs from 'fs/promises';
import jsyaml from 'js-yaml';
import os from 'os';
import {
  AsyncApiDocument,
  AsyncApiTemplateOptions,
  GeneratorOptions,
} from '#lib';

export class AsyncapiGenerator {
  private readonly generator: GeneratorOptions;
  private readonly tmpDir: string = os.tmpdir();
  private readonly fileName: string = 'index.html';
  private readonly fullFilePath = `${this.tmpDir}/${this.fileName}`;

  constructor(readonly templateOptions?: AsyncApiTemplateOptions) {
    this.generator = new Generator('@asyncapi/html-template', this.tmpDir, {
      forceWrite: true,
      entrypoint: 'index.html.js',
      output: 'fs',
      templateParams: {
        singleFile: true,
        ...templateOptions,
      },
    });
  }

  public async generate(contract: AsyncApiDocument): Promise<string> {
    const yaml = jsyaml.dump(contract);
    await this.generator.generate(yaml, {
      resolve: {
        file: false,
      },
    });

    return fs.readFile(this.fullFilePath, 'utf8');
  }
}
