import { AmqpOperationBinding, KafkaOperationBinding } from '../binding';
import {
  AsyncMessageTraitObject,
  AsyncOperationTraitObject,
  AsyncTagObject,
  ExternalDocumentationObject,
} from './asyncapi-common.interfaces';
import { AsyncOperationPayload } from './asyncapi-operation-payload.interface';

/**
 * Intermediate message representation stored by decorators after makeMessage()
 * transform. The payload still holds the raw DTO class — the factory resolves
 * it to a schema $ref.
 */
export interface RawAsyncApiMessage
  extends Omit<AsyncMessageTraitObject, 'headers' | 'traits'> {
  payload: { type: AsyncOperationPayload };
  headers?: {
    type: 'object';
    properties: Record<
      string,
      { description: string; type: 'string'; [key: string]: unknown }
    >;
  };
}

/**
 * Full operation metadata stored by decorators (post makeMessage(), pre-factory).
 * Consumed by the explorer and passed to OperationObjectFactory.
 */
export interface AsyncApiOperationOptionsRaw {
  channel: string;
  type: 'send' | 'receive';
  operationId?: string;
  title?: string;
  summary?: string;
  description?: string;
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaOperationBinding | AmqpOperationBinding>;
  traits?: AsyncOperationTraitObject[];
  message: RawAsyncApiMessage | { oneOf: RawAsyncApiMessage[] };
}
