import { OAuth2ScopeKeyType } from '../types/oauth2-scope-key.type';

export class OAuth2Flow {
  authorizationUrl: string;
  tokenUrl: string;
  refreshUrl?: string;
  scopes: { [scope: string]: OAuth2ScopeKeyType };
}
