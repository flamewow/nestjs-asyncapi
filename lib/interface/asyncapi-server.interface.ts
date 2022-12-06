import { ServerObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AmqpServerBinding, KafkaServerBinding } from '../binding';
import {
  AsyncServerVariableObject,
  SecurityObject,
} from './asyncapi-common.interfaces';

export interface AsyncServerObject extends Omit<ServerObject, 'variables'> {
  variables?: Record<string, AsyncServerVariableObject>;
  protocol: string;
  protocolVersion?: string;
  security?: SecurityObject[];
  bindings?: Record<string, KafkaServerBinding | AmqpServerBinding>;
}
