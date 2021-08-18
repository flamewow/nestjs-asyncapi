import { ApiServerSecurity } from '../types/api-server-security.type';
import { ServerVariables } from './server-variables.interface';

/** @see https://www.asyncapi.com/docs/specifications/2.0.0#servers-object-example **/
export interface ApiServerOptions {
  url: string;
  protocol: string;
  protocolVersion?: string;
  variables?: ServerVariables;
  description?: string;
  security?: ApiServerSecurity;
}
