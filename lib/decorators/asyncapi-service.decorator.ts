import { createMixedDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import {
  AmqpChannelBindingObject,
  KafkaChannelBindingObject,
} from '../binding-interfaces';
import { DECORATORS } from '../constants';

export interface AsyncApiServiceOptions {
  serviceName?: string;
  description?: string;
  bindings?: Record<
    string,
    KafkaChannelBindingObject | AmqpChannelBindingObject
  >;
}

export function AsyncApiService(options?: AsyncApiServiceOptions) {
  return createMixedDecorator(DECORATORS.AsyncapiService, options);
}
