import { AsyncOperationObject } from './asyncapi-common.interfaces';
import { AsyncOperationPayload } from './asyncapi-operation-payload.interface';

export interface RawAsyncApiMessage {
  name?: string;
  payload: {
    type: AsyncOperationPayload;
  };
  headers?: {
    type: 'object';
    properties: {
      [key: string]: {
        description: string;
        type: 'string';
        [key: string]: unknown;
      };
    };
  };
}

export interface AsyncApiOperationOptionsRaw extends AsyncOperationObject {
  type: 'sub' | 'pub';
}
