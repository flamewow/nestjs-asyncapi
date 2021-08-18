import { OAuth2Flow } from './oauth2-flow.interface';

export interface AsyncApiOAuth2Flow {
  implicit?: Omit<OAuth2Flow, 'tokenUrl'>;
  password?: OAuth2Flow;
  clientCredentials?: OAuth2Flow;
  authorizationCode?: OAuth2Flow;
}
