import { AsyncApiSecurityType } from '../enums/async-api-security-type.enum';
import { AsyncApiOAuth2Flow } from './async-api-oauth2-flow.interface';
import { SecuritySchemeIn } from '../types/security-scheme-in.type';

/**
 * Represents the OAuth flow object from Async API for security scheme
 * @see https://www.asyncapi.com/docs/specifications/2.0.0#oauthFlowObject
 */
export interface SecurityScheme {
  type: AsyncApiSecurityType;
  description?: string;
  in?: SecuritySchemeIn;
  /**
   * This is only necessary when we use type http
   * @default http
   * @see https://tools.ietf.org/html/rfc7235#section-5.1
   */
  scheme?: string;
  bearerFormat?: string;
  name?: string;
  flows?: AsyncApiOAuth2Flow;
  openIdConnectUrl?: string;
  [key: string]: any;
}
