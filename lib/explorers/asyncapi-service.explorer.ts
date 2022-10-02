import { Type } from '@nestjs/common';
import { DECORATORS } from '../constants';

export const exploreAsyncapiServiceMetadata = (metatype: Type<unknown>) => {
  return Reflect.getMetadata(DECORATORS.AsyncapiService, metatype);
};
