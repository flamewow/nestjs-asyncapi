import { AmqpOperationBinding, KafkaOperationBinding } from '../binding';
import {
  AsyncOperationTraitObject,
  AsyncTagObject,
  ExternalDocumentationObject,
} from './asyncapi-common.interfaces';
import { AsyncApiMessage } from './asyncapi-message.interface';

export interface AsyncApiSpecificOperationOptions {
  channel: string;
  operationId?: string;
  title?: string;
  summary?: string;
  description?: string;
  tags?: AsyncTagObject[];
  externalDocs?: ExternalDocumentationObject;
  bindings?: Record<string, KafkaOperationBinding | AmqpOperationBinding>;
  traits?: AsyncOperationTraitObject[];
  message: AsyncApiMessage;
}

export interface AsyncApiOperationOptions
  extends AsyncApiSpecificOperationOptions {
  type: 'send' | 'receive';
}
