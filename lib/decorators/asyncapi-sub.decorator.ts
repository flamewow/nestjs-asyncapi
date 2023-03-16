import { DECORATORS } from '../asyncapi.constants';
import {
  AsyncApiOperationOptions,
  AsyncApiSpecificOperationOptions,
} from '../interface';
import { AsyncApiOperationForMetaKey } from './asyncapi-operation-for-meta-key.decorator';

export function AsyncApiSub(
  ...specificOperationOptions: AsyncApiSpecificOperationOptions[]
) {
  const options: AsyncApiOperationOptions[] = specificOperationOptions.map(
    (i) => ({
      ...i,
      type: 'sub',
    }),
  );
  return AsyncApiOperationForMetaKey(DECORATORS.AsyncApiSub, options);
}
