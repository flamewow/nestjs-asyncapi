/**
 * AsyncAPI v3 renamed "publish/subscribe" to "send/receive" to reflect the
 * perspective of the application rather than the broker. @AsyncApiReceive means
 * "this application RECEIVES a message from this channel". This matches the
 * AsyncAPI 3.0.0 operation action `receive`.
 *
 * Migration from v1.x: replace @AsyncApiSub → @AsyncApiReceive
 */
import { DECORATORS } from '../asyncapi.constants';
import {
  AsyncApiOperationOptions,
  AsyncApiSpecificOperationOptions,
} from '../interface';
import { AsyncApiOperationForMetaKey } from './asyncapi-operation-for-meta-key.decorator';

export function AsyncApiReceive(
  ...specificOperationOptions: AsyncApiSpecificOperationOptions[]
) {
  const options: AsyncApiOperationOptions[] = specificOperationOptions.map(
    (i) => ({
      ...i,
      type: 'receive',
    }),
  );
  return AsyncApiOperationForMetaKey(DECORATORS.AsyncApiReceive, options);
}
