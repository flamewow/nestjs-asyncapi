import { DECORATORS } from '../asyncapi.constants';
import {
  AsyncApiOperationOptions,
  AsyncApiSpecificOperationOptions,
} from '../interface';
import { AsyncApiOperationForMetaKey } from './asyncapi-operation-for-meta-key.decorator';

export function AsyncApiPub(
  ...specificOperationOptions: AsyncApiSpecificOperationOptions[]
) {
  const options: AsyncApiOperationOptions[] = specificOperationOptions.map(
    (i) => ({
      ...i,
      type: 'pub',
    }),
  );
  return AsyncApiOperationForMetaKey(DECORATORS.AsyncApiPub, options);
}
