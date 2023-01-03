import {
  AsyncApiOperationOptions,
  AsyncApiSpecificOperationOptions,
} from '../interface';
import { AsyncApiOperation } from './asyncapi-operation.decorator';

export function AsyncApiPub(
  ...specificOperationOptions: AsyncApiSpecificOperationOptions[]
) {
  const options: AsyncApiOperationOptions[] = specificOperationOptions.map(
    (i) => ({
      ...i,
      type: 'pub',
    }),
  );
  return AsyncApiOperation(...options);
}
