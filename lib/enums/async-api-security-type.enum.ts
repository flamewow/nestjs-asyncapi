/**
 * @see https://www.asyncapi.com/docs/specifications/2.0.0#securitySchemeObject
 */
export enum AsyncApiSecurityType {
  UserPassword = 'userPassword',
  ApiKey = 'apiKey',
  X509 = 'X509',
  SymmetricEncryption = 'symmetricEncryption',
  AsymmetricEncryption = 'asymmetricEncryption',
  HttpApiKey = 'httpApiKey',
  Http = 'http',
  OAuth2 = 'oauth2',
  OpenIdConnect = 'openIdConnect',
}
