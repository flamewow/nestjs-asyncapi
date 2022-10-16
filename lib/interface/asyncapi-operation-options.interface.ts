import { AsyncOperationObject } from './asyncapi-common.interfaces';
import { AsyncApiOperationHeaders } from './asyncapi-operation-headers.interface';
import { AsyncOperationPayload } from './asyncapi-operation-payload.interface';

export interface AsyncApiOperationOptions extends AsyncOperationObject {
  /**
   * message type
   */
  type: AsyncOperationPayload;

  /**
   * message name
   */
  name?: string;

  /**
   * message headers
   */
  headers?: AsyncApiOperationHeaders;
}
