import {
  AsyncApiOperationOptions,
  AsyncApiSpecificOperationOptions,
} from '../interface';
import { AsyncApiOperation } from './asyncapi-operation.decorator';

export function AsyncApiSub(
  ...specificOperationOptions: AsyncApiSpecificOperationOptions[]
) {
  const options: AsyncApiOperationOptions[] = specificOperationOptions.map(
    (i) => ({
      ...i,
      type: 'sub',
    }),
  );
  return AsyncApiOperation(...options);
}
