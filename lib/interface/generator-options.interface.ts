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
  templateConfig: Record<string, any>;
  hooks: Record<string, any>;
  templateParams: AsyncApiTemplateOptions;
  generate: (document: any) => Promise<void>;
  generateFromURL: (url: string) => Promise<void>;
  generateFromFile: (path: string) => Promise<void>;
  generateFromString: (yaml: string, args?: any) => Promise<string>;
}
