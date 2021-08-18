import { AsyncApiSchemaObject } from './async-api-schema-object.interface';

export class AsyncApiParamObject {
  description?: string;
  location: string;
  schema: AsyncApiSchemaObject;
}
