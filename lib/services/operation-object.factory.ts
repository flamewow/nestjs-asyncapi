import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor';
import { SchemaObjectFactory } from '@nestjs/swagger/dist/services/schema-object-factory';
import { SwaggerTypesMapper } from '@nestjs/swagger/dist/services/swagger-types-mapper';
import { getSchemaPath } from '@nestjs/swagger/dist/utils';
import {
  AsyncApiOperationOptionsRaw,
  AsyncMessageObject,
  AsyncOperationObject,
  OneOfMessageType,
} from '../interface';

export class OperationObjectFactory {
  private readonly modelPropertiesAccessor = new ModelPropertiesAccessor();
  private readonly swaggerTypesMapper = new SwaggerTypesMapper();
  private readonly schemaObjectFactory = new SchemaObjectFactory(
    this.modelPropertiesAccessor,
    this.swaggerTypesMapper,
  );

  create(
    operation: AsyncApiOperationOptionsRaw,
    produces: string[],
    schemas: Record<string, SchemaObject>,
  ): AsyncOperationObject {
    const { message } = operation;
    const { oneOf } = message as OneOfMessageType;

    if (oneOf) {
      return {
        ...operation,
        message: {
          oneOf: oneOf.map((i) => ({
            ...i,
            payload: {
              $ref: getSchemaPath(
                this.getDtoName(i as AsyncMessageObject, schemas),
              ),
            },
          })),
        },
      };
    }

    return {
      ...operation,
      message: {
        ...operation.message,
        payload: {
          $ref: getSchemaPath(
            this.getDtoName(message as AsyncMessageObject, schemas),
          ),
        },
      },
    };
  }

  private getDtoName(
    message: AsyncMessageObject,
    schemas: Record<string, SchemaObject>,
  ): string {
    const messagePayloadType = message.payload.type as Function;
    return this.schemaObjectFactory.exploreModelSchema(
      messagePayloadType,
      schemas,
    );
  }
}
