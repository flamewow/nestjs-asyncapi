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
  const metadataSubs: AsyncApiOperationOptionsRaw[] = Reflect.getMetadata(
    DECORATORS.AsyncApiSub,
    method,
  );
  const metadataPubs: AsyncApiOperationOptionsRaw[] = Reflect.getMetadata(
    DECORATORS.AsyncApiPub,
    method,
  );

  const metadataCombined = [
    ...(metadataOperations ? Object.values(metadataOperations) : []),
    ...(metadataSubs ? Object.values(metadataSubs) : []),
    ...(metadataPubs ? Object.values(metadataPubs) : []),
  ];

  return metadataCombined.map((option: AsyncApiOperationOptionsRaw) => {
    const { channel, type } = option;

    const methodTypeData = {
      ...option,
      ...operationObjectFactory.create(option, ['application/json'], schemas),
      channel: undefined,
      type: undefined,
    };

    return {
      channel,
      [type]: methodTypeData,
    };
  });
};
