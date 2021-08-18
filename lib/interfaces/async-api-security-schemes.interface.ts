import { SecurityScheme } from './security-scheme.interface';

export interface AsyncApiSecuritySchemes {
  [name: string]: SecurityScheme;
}
