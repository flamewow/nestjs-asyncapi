import { AsyncApiTags } from './async-api-tags.interface';
import { AsyncApiExternalDocs } from './async-api-external-docs.interface';
import { AsyncApiBindings } from './async-api-bindings.interface';

export interface AsyncApiTraits {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: AsyncApiTags;
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiBindings;
}
