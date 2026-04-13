import {
  AmqpChannelBinding,
  AmqpOperationBinding,
  KafkaChannelBinding,
  KafkaOperationBinding,
} from '../binding';
import {
  AsyncMessageObject,
  AsyncOperationTraitObject,
  AsyncTagObject,
  ExternalDocumentationObject,
  ParameterObject,
} from './asyncapi-common.interfaces';

/**
 * Per-operation data collected by the explorer after the factory resolves
 * DTO payloads to schema $refs. This is the post-factory, pre-transformer
 * intermediate state.
 */
export interface DenormalizedOperation {
  operationId?: string;
  title?: string;
  summary?: string;
  description?: string;
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaOperationBinding | AmqpOperationBinding>;
  traits?: AsyncOperationTraitObject[];
  /** Named message map — key is the message name, value has payload resolved to $ref. */
  messages: Record<string, AsyncMessageObject>;
}

/**
 * Intermediate per-channel document collected per class/method before the
 * transformer normalises everything into the final AsyncApiDocument shape.
 */
export interface DenormalizedDoc {
  root?: {
    name: string;
    description?: string;
    parameters?: Record<string, ParameterObject>;
    bindings?: Record<string, KafkaChannelBinding | AmqpChannelBinding>;
  };
  operations?: {
    send?: DenormalizedOperation;
    receive?: DenormalizedOperation;
  };
}
