import { Type } from '@nestjs/common';
import { createMixedDecorator } from '@nestjs/swagger/dist/decorators/helpers';

import { AsyncOperationObject } from '..';

import { DECORATORS } from '../constants';

export interface AsyncOperationOptions extends Omit<AsyncOperationObject, 'message'> {
  message: {
    name: string;
    payload: {
      type: Type<unknown> | Function | [Function] | string;
    };
  };
}

export function AsyncApiPub(...options: AsyncOperationOptions[]): MethodDecorator & ClassDecorator {
  return createMixedDecorator(DECORATORS.ASYNCAPI_PUB, options);
}

export function AsyncApiSub(...options: AsyncOperationOptions[]): MethodDecorator & ClassDecorator {
  return createMixedDecorator(DECORATORS.ASYNCAPI_SUB, options);
}
