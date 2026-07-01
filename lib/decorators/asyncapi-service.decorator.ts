import { DECORATORS } from '../asyncapi.constants';
import { createMixedDecorator } from './helpers';

/**
 * Mark class that has to be scanned for AsyncApi operations
 */
export function AsyncApi() {
  return createMixedDecorator(DECORATORS.AsyncApiClass, true);
}
