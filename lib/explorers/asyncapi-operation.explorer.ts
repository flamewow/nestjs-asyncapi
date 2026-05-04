import { Type } from '@nestjs/common';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DECORATORS } from '../asyncapi.constants';
import { AsyncApiOperationOptionsRaw } from '../interface';
import { OperationObjectFactory } from '../services';

const operationObjectFactory = new OperationObjectFactory();

export const exploreAsyncApiOperationMetadata = (
  schemas: Record<string, SchemaObject>,
  _instance: object,
  _prototype: Type<unknown>,
  method: object,
) => {
  const metadataOperations: AsyncApiOperationOptionsRaw[] = Reflect.getMetadata(
    DECORATORS.AsyncApiOperation,
    method,
  );
  const metadataReceives: AsyncApiOperationOptionsRaw[] = Reflect.getMetadata(
    DECORATORS.AsyncApiReceive,
    method,
  );
  const metadataSends: AsyncApiOperationOptionsRaw[] = Reflect.getMetadata(
    DECORATORS.AsyncApiSend,
    method,
  );

  const metadataCombined = [
    ...(metadataOperations ? Object.values(metadataOperations) : []),
    ...(metadataReceives ? Object.values(metadataReceives) : []),
    ...(metadataSends ? Object.values(metadataSends) : []),
  ];

  return metadataCombined.map((option: AsyncApiOperationOptionsRaw) => {
    const { channel, type } = option;
    const denormalizedOperation = operationObjectFactory.create(
      option,
      schemas,
    );
    return { channel, [type]: denormalizedOperation };
  });
};
