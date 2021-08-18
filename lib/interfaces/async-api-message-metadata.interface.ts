import { AsyncApiExternalDocs } from './async-api-external-docs.interface';
import { AsyncApiTags } from './async-api-tags.interface';
import { AsyncApiBindings } from './async-api-bindings.interface';
import { AsyncApiExamples } from './async-api-examples.interface';

export class AsyncApiMessageMetadata {
  headers?: string[];
  correlationId?: string;
  /** @see https://www.asyncapi.com/docs/specifications/2.0.0#messageObjectSchemaFormatTable **/
  schemaFormat?: string;
  /** @see https://www.asyncapi.com/docs/specifications/2.0.0#defaultContentTypeString **/
  contentType?: string;
  /** @default class name **/
  name?: string;
  title?: string;
  summary?: string;
  description?: string;
  tags?: AsyncApiTags;
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiBindings;
  examples?: AsyncApiExamples;
}
