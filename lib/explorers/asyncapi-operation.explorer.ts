import { Type } from '@nestjs/common';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DECORATORS } from '..';
import { OperationObjectFactory } from '../services';

const operationObjectFactory = new OperationObjectFactory();

export const exploreAsyncapiOperationMetadata = (
  schemas: Record<string, SchemaObject>,
  _schemaRefsStack: [],
  instance: object,
  prototype: Type<unknown>,
  method: object,
) => {
  const pubObject = exploreAsyncapiPubMetadata(
    schemas,
    instance,
    prototype,
    method,
  );
  const subObject = exploreAsyncapiSubMetadata(
    schemas,
    instance,
    prototype,
    method,
  );

  return { ...pubObject, ...subObject };
};

export const exploreAsyncapiPubMetadata = (
  schemas: Record<string, SchemaObject>,
  _instance: object,
  _prototype: Type<unknown>,
  method: object,
) => {
  const metadata = Reflect.getMetadata(DECORATORS.ASYNCAPI_PUB, method);

  if (!metadata) {
    return;
  }

  return metadata.map((option) => ({
    channel: option.channel,
    pub: {
      ...option,
      ...operationObjectFactory.create(option, ['application/json'], schemas),
      channel: undefined,
    },
  }));
};
export const exploreAsyncapiSubMetadata = (
  schemas: Record<string, SchemaObject>,
  _instance: object,
  _prototype: Type<unknown>,
  method: object,
) => {
  const metadata = Reflect.getMetadata(DECORATORS.ASYNCAPI_SUB, method);

  if (!metadata) {
    return;
  }

  return metadata.map((option) => ({
    channel: option.channel,
    sub: {
      ...option,
      ...operationObjectFactory.create(option, ['application/json'], schemas),
      channel: undefined,
    },
  }));
};
