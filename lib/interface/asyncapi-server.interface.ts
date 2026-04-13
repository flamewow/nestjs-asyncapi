import { ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AmqpServerBinding, KafkaServerBinding } from '../binding';
import {
  AsyncSecuritySchemeObject,
  AsyncServerVariableObject,
  AsyncTagObject,
  ExternalDocumentationObject,
} from './asyncapi-common.interfaces';

export interface AsyncServerObject {
  host: string;
  pathname?: string;
  protocol: string;
  protocolVersion?: string;
  description?: string;
  title?: string;
  summary?: string;
  variables?: Record<string, AsyncServerVariableObject>;
  /**
   * In AsyncAPI v3, each security item is either an inline SecurityScheme
   * or a $ref to a named scheme in components.securitySchemes.
   *
   * @example [{ $ref: '#/components/securitySchemes/myScheme' }]
   */
  security?: (AsyncSecuritySchemeObject | ReferenceObject)[];
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaServerBinding | AmqpServerBinding>;
}
