/**
 * AsyncAPI v3 renamed "publish/subscribe" to "send/receive" to reflect the
 * perspective of the application rather than the broker. @AsyncApiSend means
 * "this application SENDS a message to this channel". This matches the
 * AsyncAPI 3.0.0 operation action `send`.
 *
 * Migration from v1.x: replace @AsyncApiPub → @AsyncApiSend
 */
import { DECORATORS } from '../asyncapi.constants';
import {
  AsyncApiOperationOptions,
  AsyncApiSpecificOperationOptions,
} from '../interface';
import { AsyncApiOperationForMetaKey } from './asyncapi-operation-for-meta-key.decorator';

export function AsyncApiSend(
  ...specificOperationOptions: AsyncApiSpecificOperationOptions[]
) {
  const options: AsyncApiOperationOptions[] = specificOperationOptions.map(
    (i) => ({
      ...i,
      type: 'send',
    }),
  );
  return AsyncApiOperationForMetaKey(DECORATORS.AsyncApiSend, options);
}
