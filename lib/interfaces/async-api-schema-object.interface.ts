import { AsyncApiExternalDocs } from './async-api-external-docs.interface';
import { AsyncApiReferenceObject } from './async-api-reference-object.interface';

/**
 * @see https://www.asyncapi.com/docs/specifications/2.0.0#properties
 * @todo Still missing properties
 * **/
export interface AsyncApiSchemaObject {
  discriminator: string;
  /** @default false **/
  deprecated?: boolean;
  externalDocs?: AsyncApiExternalDocs;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: any;
  example?: any;
  examples?: any[];
  type?: string;
  allOf?: (AsyncApiSchemaObject | AsyncApiReferenceObject)[];
  oneOf?: (AsyncApiSchemaObject | AsyncApiReferenceObject)[];
  anyOf?: (AsyncApiSchemaObject | AsyncApiReferenceObject)[];
  not?: AsyncApiSchemaObject | AsyncApiReferenceObject;
  items?: AsyncApiSchemaObject | AsyncApiReferenceObject;
  properties?: Record<string, AsyncApiSchemaObject | AsyncApiReferenceObject>;
  additionalProperties?: AsyncApiSchemaObject | AsyncApiReferenceObject | boolean;
  description?: string;
  format?: string;
  default?: any;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
}
