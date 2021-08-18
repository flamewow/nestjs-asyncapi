import { AsyncApiSecuritySchemes } from './async-api-security-schemes.interface';

export interface AsyncApiComponents {
  securitySchemes?: AsyncApiSecuritySchemes;
  [key: string]: any;
}
