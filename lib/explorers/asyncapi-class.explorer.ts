import { Type } from '@nestjs/common';
import { CONTROLLER_WATERMARK } from '@nestjs/common/constants';
import { DECORATORS } from '../asyncapi.constants';

let GATEWAY_METADATA;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const wsConstants = require('@nestjs/websockets/constants');
  GATEWAY_METADATA = wsConstants.GATEWAY_METADATA;
} catch {
  GATEWAY_METADATA = '__gateway__'; // in case @nestjs/websockets is not installed GATEWAY_METADATA value is irrelevant
}

export const asyncApiClassAnnotationLabels = [
  DECORATORS.AsyncApiClass,
  CONTROLLER_WATERMARK,
  GATEWAY_METADATA,
];

export const exploreAsyncapiClassMetadata = (metatype: Type<unknown>) => {
  return Reflect.getMetadata(DECORATORS.AsyncApiClass, metatype);
};

export const exploreControllerMetadata = (metatype: Type<unknown>) => {
  return Reflect.getMetadata(CONTROLLER_WATERMARK, metatype);
};

export const exploreGatewayMetadata = (metatype: Type<unknown>) => {
  return Reflect.getMetadata(GATEWAY_METADATA, metatype);
};
