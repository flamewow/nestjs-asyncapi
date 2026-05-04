import Generator from '@asyncapi/generator';
import fs from 'fs/promises';
import jsyaml from 'js-yaml';
import os from 'os';
import path from 'path';
import {
  AsyncApiDocument,
  AsyncApiTemplateOptions,
  GeneratorOptions,
} from '../interface';

export class AsyncapiGenerator {
  private readonly generator: GeneratorOptions;
  private readonly outDir: string;
  private readonly outFilename: string;

  constructor(readonly templateOptions?: AsyncApiTemplateOptions) {
    const {
      singleFile = true,
      outFilename = 'index.html',
      ...rest
    } = templateOptions ?? {};

    this.outDir = os.tmpdir();
    // The html-template v3 React component names the output file via
    // `params.outFilename` (defaults to 'index.html').  We capture it here so
    // we know which file to read after fs-mode generation.
    this.outFilename = outFilename;

    this.generator = new Generator('@asyncapi/html-template', this.outDir, {
      forceWrite: true,
      entrypoint: 'index.html.js',
      // Use 'fs' output: generator v2 generate() is Promise<void> and does not
      // return the rendered string even in 'string' mode.  We write to a temp
      // file instead and read it back below.
      templateParams: {
        // The html-template v3 expects singleFile as a string.
        singleFile: String(singleFile),
        outFilename,
        ...rest,
      },
    });
  }

  public async generate(contract: AsyncApiDocument): Promise<string> {
    const yaml = jsyaml.dump(contract);
    await this.generator.generateFromString(yaml, {
      resolve: {
        file: false,
      },
    });
    return fs.readFile(path.join(this.outDir, this.outFilename), 'utf-8');
  }
}
