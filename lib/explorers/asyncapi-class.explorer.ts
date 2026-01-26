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

let EVENTS_HANDLER_METADATA;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cqrsConstants = require('@nestjs/cqrs/dist/decorators/constants');
  EVENTS_HANDLER_METADATA = cqrsConstants.EVENTS_HANDLER_METADATA;
} catch {
  EVENTS_HANDLER_METADATA = '__events_handler__'; // in case @nestjs/cqrs is not installed
}

export const asyncApiClassAnnotationLabels = [
  DECORATORS.AsyncApiClass,
  CONTROLLER_WATERMARK,
  GATEWAY_METADATA,
  EVENTS_HANDLER_METADATA,
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

export const exploreEventsHandlerMetadata = (metatype: Type<unknown>) => {
  return Reflect.getMetadata(EVENTS_HANDLER_METADATA, metatype);
};
