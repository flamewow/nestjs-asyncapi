import { AsyncApiExternalDocs } from './async-api-external-docs.interface';

/** @see https://www.asyncapi.com/docs/specifications/2.0.0#tagsObject **/
export interface AsyncApiTags {
  name: string;
  description: string;
  externalDocs?: AsyncApiExternalDocs;
}
