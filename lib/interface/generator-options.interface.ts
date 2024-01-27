import { AsyncApiDocument } from './asyncapi-common.interfaces';
import { AsyncApiTemplateOptions } from './asyncapi-template-options.interface';

export interface GeneratorOptions {
  templateName: string;
  targetDir: string;
  entrypoint?: string;
  noOverwriteGlobs: string[];
  disabledHooks: { [key: string]: string | boolean | string[] };
  output: 'string' | 'fs';
  forceWrite: boolean;
  debug: boolean;
  install: boolean;
  templateConfig: Record<string, unknown>;
  hooks: Record<string, unknown>;
  templateParams: AsyncApiTemplateOptions;
  generate: (document: AsyncApiDocument) => Promise<void>;
  generateFromURL: (url: string) => Promise<void>;
  generateFromFile: (path: string) => Promise<void>;
  generateFromString: (yaml: string, args?: unknown) => Promise<string>;
}
