import { AsyncApiExternalDocs } from './async-api-external-docs.interface';
import { AsyncApiTags } from './async-api-tags.interface';
import { AsyncApiBindings } from './async-api-bindings.interface';
import { AsyncApiMessageMetadata } from './async-api-message-metadata.interface';
import { AsyncApiTraits } from './async-api-traits.interface';
import { AsyncApiReferenceObject } from './async-api-reference-object.interface';

export class AsyncApiOperation<MessageType = AsyncApiMessageMetadata | AsyncApiReferenceObject> {
  summary?: string;
  /** @default we generate **/
  operationId?: string;
  description?: string;
  tags?: AsyncApiTags;
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiBindings;
  traits?: AsyncApiTraits;
  message: MessageType;
}
