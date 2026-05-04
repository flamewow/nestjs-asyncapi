import {
  InfoObject,
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  AmqpChannelBinding,
  AmqpMessageBinding,
  AmqpOperationBinding,
  AmqpServerBinding,
  KafkaChannelBinding,
  KafkaMessageBinding,
  KafkaOperationBinding,
  KafkaServerBinding,
} from '../binding';
import { AsyncServerObject } from './asyncapi-server.interface';

/**
 * Extends the OpenAPI InfoObject with the `tags` field defined by AsyncAPI v3.
 * In v3, tags are declared under `info`, not at the root of the document.
 */
export interface AsyncApiInfoObject extends InfoObject {
  tags?: AsyncTagObject[];
}

export interface AsyncApiDocument {
  asyncapi: string;
  id?: string;
  info: AsyncApiInfoObject;
  servers?: Record<string, AsyncServerObject>;
  channels?: AsyncChannelsObject;
  operations?: AsyncOperationsObject;
  components?: AsyncComponentsObject;
  externalDocs?: ExternalDocumentationObject;
  defaultContentType?: string;
}

export type AsyncChannelsObject = Record<string, AsyncChannelObject>;

export interface AsyncChannelObject {
  address?: string;
  description?: string;
  messages?: Record<string, AsyncMessageObject | ReferenceObject>;
  parameters?: Record<string, ParameterObject>;
  bindings?: Record<string, KafkaChannelBinding | AmqpChannelBinding>;
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
}

export type AsyncOperationsObject = Record<string, AsyncOperationObject>;

export interface AsyncOperationObject {
  action: 'send' | 'receive';
  channel: ReferenceObject;
  title?: string;
  summary?: string;
  description?: string;
  security?: SecurityObject[];
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaOperationBinding | AmqpOperationBinding>;
  traits?: (AsyncOperationTraitObject | ReferenceObject)[];
  messages?: ReferenceObject[];
}

export interface AsyncServerVariableObject {
  enum?: string[];
  default?: string;
  description?: string;
  examples?: string[];
}

export type SecurityObject = Record<string, string[]>;

export interface AsyncComponentsObject {
  schemas?: Record<string, SchemaObject>;
  messages?: Record<string, AsyncMessageObject>;
  securitySchemes?: Record<string, AsyncSecuritySchemeObject>;
  parameters?: Record<string, ParameterObject>;
  correlationIds?: Record<string, AsyncCorrelationObject>;
  operationTraits?: Record<string, AsyncOperationTraitObject>;
  messageTraits?: Record<string, AsyncMessageTraitObject>;
  serverBindings?: Record<string, KafkaServerBinding | AmqpServerBinding>;
  channelBindings?: Record<string, KafkaChannelBinding | AmqpChannelBinding>;
  operationBindings?: Record<
    string,
    KafkaOperationBinding | AmqpOperationBinding
  >;
  messageBindings?: Record<string, KafkaMessageBinding | AmqpMessageBinding>;
}

export interface AsyncMessageObject extends AsyncMessageTraitObject {
  payload?: SchemaObject | ReferenceObject;
}

export interface AsyncOperationTraitObject {
  title?: string;
  summary?: string;
  description?: string;
  security?: SecurityObject[];
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaOperationBinding | AmqpOperationBinding>;
}

export interface AsyncMessageTraitObject {
  headers?: SchemaObject | ReferenceObject;
  correlationId?: AsyncCorrelationObject | ReferenceObject;
  schemaFormat?: string;
  contentType?: string;
  name?: string;
  title?: string;
  summary?: string;
  description?: string;
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaMessageBinding | AmqpMessageBinding>;
  traits?: (AsyncMessageTraitObject | ReferenceObject)[];
}

export interface AsyncCorrelationObject {
  description?: string;
  location: string;
}

export interface AsyncTagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}

export interface AsyncSecuritySchemeObject {
  type: SecuritySchemeType;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlowsObject;
  openIdConnectUrl?: string;
}

export type SecuritySchemeType =
  | 'userPassword'
  | 'apiKey'
  | 'X509'
  | 'symmetricEncryption'
  | 'asymmetricEncryption'
  | 'http'
  | 'oauth2'
  | 'openIdConnect';

export interface OAuthFlowsObject {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
}

export interface OAuthFlowObject {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: ScopesObject;
}

export type ScopesObject = Record<string, unknown>;

export type ParameterObject = BaseParameterObject;

export interface BaseParameterObject {
  description?: string;
  schema?: SchemaObject | ReferenceObject;
  location?: string;
}

export interface ExternalDocumentationObject {
  description?: string;
  url: string;
}
