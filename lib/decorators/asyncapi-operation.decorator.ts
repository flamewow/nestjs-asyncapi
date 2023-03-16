import { DECORATORS } from '../asyncapi.constants';
import { AsyncApiOperationOptions } from '../interface';
import { AsyncApiOperationForMetaKey } from './asyncapi-operation-for-meta-key.decorator';

export function AsyncApiOperation(
  ...options: AsyncApiOperationOptions[]
): MethodDecorator {
  return AsyncApiOperationForMetaKey(DECORATORS.AsyncApiOperation, options);
}
