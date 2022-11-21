import { Type } from '@nestjs/common';
import { CONTROLLER_WATERMARK } from '@nestjs/common/constants';
import { GATEWAY_METADATA } from '@nestjs/websockets/constants';
import { DECORATORS } from '../asyncapi.constants';

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
