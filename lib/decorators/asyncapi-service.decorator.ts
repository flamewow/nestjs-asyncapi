import { createMixedDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import { DECORATORS } from '../asyncapi.constants';

/**
 * Mark class that has to be scanned for AsyncApi operations
 */
export function AsyncApi() {
  return createMixedDecorator(DECORATORS.AsyncApiClass, true);
}
