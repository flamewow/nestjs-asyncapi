import { AsyncOperationObject } from './asyncapi-common.interfaces';
import { AsyncApiOperationHeaders } from './asyncapi-operation-headers.interface';
import { AsyncOperationPayload } from './asyncapi-operation-payload.interface';

export interface AsyncApiSpecificOperationOptions extends AsyncOperationObject {
  /**
   * message payload
   */
  payload: AsyncOperationPayload;

  /**
   * message name
   */
  name?: string;

  /**
   * message headers
   */
  headers?: AsyncApiOperationHeaders;
}

export interface AsyncApiOperationOptions
  extends AsyncApiSpecificOperationOptions {
  type: 'pub' | 'sub';
}
