import { AsyncOperationHeadersOut } from './async-operation-headers.interface';
import { AsyncOperationObject } from './asyncapi-common.interfaces';
import { AsyncOperationPayload } from './asyncapi-operation-payload.interface';

export interface AsyncOperationOptions extends AsyncOperationObject {
  message: {
    name?: string;
    payload: {
      type: AsyncOperationPayload;
    };
    headers?: AsyncOperationHeadersOut;
  };
}
