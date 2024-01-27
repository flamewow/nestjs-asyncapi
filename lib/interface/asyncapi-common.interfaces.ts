import {
  InfoObject,
  ReferenceObject,
  SchemaObject,
  ServerVariableObject,
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
import { AsyncOperationPayload } from './asyncapi-operation-payload.interface';
import { AsyncServerObject } from './asyncapi-server.interface';

export interface AsyncApiDocument {
  asyncapi: string;
  id?: string;
  info: InfoObject;
  servers?: Record<string, AsyncServerObject>;
  channels: AsyncChannelsObject;
  components?: AsyncComponentsObject;
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  defaultContentType?: string;
}

export type AsyncChannelsObject = Record<string, AsyncChannelObject>;
export interface AsyncChannelObject {
  description?: string;
  subscribe?: AsyncOperationObject;
  publish?: AsyncOperationObject;
  parameters?: Record<string, ParameterObject>;
  bindings?: Record<string, KafkaChannelBinding | AmqpChannelBinding>;
}

export interface AsyncServerVariableObject extends ServerVariableObject {
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
  payload?: {
    type?: AsyncOperationPayload;
    $ref?: AsyncOperationPayload;
  };
}

export type MessageType = AsyncMessageObject | ReferenceObject;
export interface OneOfMessageType {
  oneOf: MessageType[];
}

export type AsyncOperationMessage = OneOfMessageType | MessageType;

export interface AsyncOperationObject {
  channel: string;
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaOperationBinding | AmqpOperationBinding>;
  traits?: Record<string, AsyncOperationTraitObject>;
  message?: AsyncOperationMessage;
}

export interface AsyncOperationTraitObject {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaOperationBinding | AmqpOperationBinding>;
}

export interface AsyncMessageTraitObject {
  headers?: SchemaObject;
  correlationId?: AsyncCorrelationObject;
  schemaFormat?: string;
  contentType?: string;
  name?: string;
  title?: string;
  summary?: string;
  description?: string;
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaMessageBinding | AmqpMessageBinding>;
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

export declare type SecuritySchemeType =
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
