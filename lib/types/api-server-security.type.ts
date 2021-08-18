import { OAuth2ScopeKeyType } from './oauth2-scope-key.type';

interface SecurityDictionary {
  [scope: string]: OAuth2ScopeKeyType[];
}

/**
 * Represents an array of scopes required for the server security but its only required in OAuth2Flow
 * If you use other server security such as user-password then you simply pass an empty array
 */
export type ApiServerSecurity = Array<SecurityDictionary>;
