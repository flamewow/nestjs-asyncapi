import { AsyncApiSecuritySchemes } from './async-api-security-schemes.interface';
import { AsyncApiChannels } from './async-api-channels.interface';

export interface AsyncApiComponents {
  securitySchemes?: AsyncApiSecuritySchemes;
  [key: string]: any;
}
