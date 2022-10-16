import { createMixedDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import { DECORATORS } from '../constants';
import { AsyncOperationOptions } from '../interface';

/**
 * @deprecated use AsyncApiPublish instead
 */
export function AsyncApiPub(
  ...options: AsyncOperationOptions[]
): MethodDecorator & ClassDecorator {
  return createMixedDecorator(DECORATORS.AsyncapiPub, options);
}

/**
 * @deprecated use AsyncApiSubscribe instead
 */
export function AsyncApiSub(
  ...options: AsyncOperationOptions[]
): MethodDecorator & ClassDecorator {
  return createMixedDecorator(DECORATORS.AsyncapiSub, options);
}
