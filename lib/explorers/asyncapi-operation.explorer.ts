import { Type } from '@nestjs/common';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DECORATORS } from '../constants';
import { OperationObjectFactory } from '../services';

const operationObjectFactory = new OperationObjectFactory();

enum AsyncapiMetadataType {
  pub = 'pub',
  sub = 'sub',
}

const typeDecoratorsMap = {
  [AsyncapiMetadataType.pub]: DECORATORS.AsyncapiPub,
  [AsyncapiMetadataType.sub]: DECORATORS.AsyncapiSub,
};

export const exploreAsyncapiMetadata = (
  type: AsyncapiMetadataType,
  schemas: Record<string, SchemaObject>,
  _instance: object,
  _prototype: Type<unknown>,
  method: object,
) => {
  const metadata = Reflect.getMetadata(typeDecoratorsMap[type], method);

  if (!metadata) {
    return;
  }

  return metadata.map((option) => ({
    channel: option.channel,
    [type]: {
      ...option,
      ...operationObjectFactory.create(option, ['application/json'], schemas),
      channel: undefined,
    },
  }));
};

export function exploreAsyncapiPubMetadata(
  schemas: Record<string, SchemaObject>,
  _instance: object,
  _prototype: Type<unknown>,
  method: object,
) {
  return exploreAsyncapiMetadata(
    AsyncapiMetadataType.pub,
    schemas,
    _instance,
    _prototype,
    method,
  );
}

export function exploreAsyncapiSubMetadata(
  schemas: Record<string, SchemaObject>,
  _instance: object,
  _prototype: Type<unknown>,
  method: object,
) {
  return exploreAsyncapiMetadata(
    AsyncapiMetadataType.sub,
    schemas,
    _instance,
    _prototype,
    method,
  );
}
