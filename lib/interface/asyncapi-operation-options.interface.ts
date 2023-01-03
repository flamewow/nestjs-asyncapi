import { AsyncOperationObject } from './asyncapi-common.interfaces';
import { AsyncApiMessage } from './asyncapi-message.interface';

export interface AsyncApiSpecificOperationOptions
  extends Omit<AsyncOperationObject, 'message'> {
  message: AsyncApiMessage;
}

export interface AsyncApiOperationOptions
  extends AsyncApiSpecificOperationOptions {
  type: 'pub' | 'sub';
}
