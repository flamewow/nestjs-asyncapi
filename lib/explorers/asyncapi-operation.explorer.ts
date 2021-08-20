import { Type } from '@nestjs/common';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AsyncOperationOptions, DECORATORS } from '@lib';
import { OperationObjectFactory } from '../services/operation-object.factory';

const operationObjectFactory = new OperationObjectFactory();

export const exploreAsyncapiOperationMetadata = (
  schemas: Record<string, SchemaObject>,
  _schemaRefsStack: [],
  instance: object,
  prototype: Type<unknown>,
  method: object,
) => {
  const pubMetadata: AsyncOperationOptions = exploreAsyncapiPubMetadata(instance, prototype, method);
  const subMetadata: AsyncOperationOptions = exploreAsyncapiSubMetadata(instance, prototype, method);

  let pubObject = {};
  if (pubMetadata) {
    pubObject = {
      channel: pubMetadata.channel,
      pub: {
        ...pubMetadata,
        ...operationObjectFactory.create(pubMetadata, ['application/json'], schemas),
        channel: undefined,
      },
    };
  }

  let subObject = {};
  if (subMetadata) {
    subObject = {
      channel: subMetadata.channel,
      sub: {
        ...subMetadata,
        ...operationObjectFactory.create(subMetadata, ['application/json'], schemas),
        channel: undefined,
      },
    };
  }

  return { ...pubObject, ...subObject };
};

export const exploreAsyncapiPubMetadata = (_instance: object, _prototype: Type<unknown>, method: object) => {
  return Reflect.getMetadata(DECORATORS.ASYNCAPI_PUB, method);
};
export const exploreAsyncapiSubMetadata = (_instance: object, _prototype: Type<unknown>, method: object) => {
  return Reflect.getMetadata(DECORATORS.ASYNCAPI_SUB, method);
};
