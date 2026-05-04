import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor';
import { SchemaObjectFactory } from '@nestjs/swagger/dist/services/schema-object-factory';
import { SwaggerTypesMapper } from '@nestjs/swagger/dist/services/swagger-types-mapper';
import { getSchemaPath } from '@nestjs/swagger/dist/utils';
import {
  AsyncApiOperationOptionsRaw,
  AsyncMessageObject,
  DenormalizedOperation,
  RawAsyncApiMessage,
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
    schemas: Record<string, SchemaObject>,
  ): DenormalizedOperation {
    const { message, channel: _channel, type: _type, ...rest } = operation;
    const rawMessages = 'oneOf' in message ? message.oneOf : [message];

    const messages: Record<string, AsyncMessageObject> = {};
    for (const raw of rawMessages) {
      const resolved = this.resolveMessage(raw, schemas);
      messages[resolved.name] = resolved.message;
    }

    return { ...rest, messages };
  }

  private resolveMessage(
    raw: RawAsyncApiMessage,
    schemas: Record<string, SchemaObject>,
  ): { name: string; message: AsyncMessageObject } {
    const dtoName = this.getDtoName(raw, schemas);
    const { payload: _payload, ...rest } = raw;

    const message: AsyncMessageObject = {
      ...rest,
      payload: { $ref: getSchemaPath(dtoName) },
    };

    // Use the explicit name if provided, otherwise fall back to the DTO class name.
    const name = raw.name || dtoName;
    return { name, message };
  }

  private getDtoName(
    raw: RawAsyncApiMessage,
    schemas: Record<string, SchemaObject>,
  ): string {
    return this.schemaObjectFactory.exploreModelSchema(
      raw.payload.type as Function,
      schemas,
    );
  }
}
