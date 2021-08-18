/**
 * Available options for security scheme property "in"
 * @see https://www.asyncapi.com/docs/specifications/2.0.0#oauthFlowObject
 */
export type SecuritySchemeIn =
  | 'user'
  | 'password'
  | 'apiKey'
  | 'query'
  | 'header'
  | 'cookie'
  | 'httpApiKey';
