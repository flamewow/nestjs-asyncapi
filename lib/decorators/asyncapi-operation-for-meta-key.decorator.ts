import { createMethodDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import {
  AsyncApiOperationOptions,
  AsyncApiOperationOptionsRaw,
  RawAsyncApiMessage,
} from '../interface';
import { OneAsyncApiMessage } from '../interface/asyncapi-message.interface';
import { AsyncApiOperationHeaders } from '../interface/asyncapi-operation-headers.interface';

function makeHeaders(headers?: AsyncApiOperationHeaders) {
  return headers
    ? {
        type: 'object' as const,
        properties: Object.entries(headers)
          .map(([key, value]) => ({
            [key]: {
              type: 'string' as const,
              ...value,
            },
          }))
          .reduce((acc, j) => ({ ...acc, ...j }), {}),
      }
    : undefined;
}

/**
 * Sanitizes a message name so it can safely be used as a JSON Reference key.
 * Replaces characters that are invalid in JSON Pointer fragments
 * (`#`, `/`, spaces) with underscores.
 */
function sanitizeMessageName(name: string): string {
  return name.replace(/[#/\s]+/g, '_');
}

function makeMessage(
  message: OneAsyncApiMessage,
  defaultName: string,
): RawAsyncApiMessage {
  const rawName = message.name || defaultName;
  return {
    name: sanitizeMessageName(rawName),
    payload: { type: message.payload },
    headers: makeHeaders(message.headers),
  };
}

export function AsyncApiOperationForMetaKey(
  metaKey: string,
  options: AsyncApiOperationOptions[],
): MethodDecorator {
  return (target, propertyKey: string | symbol, descriptor) => {
    const methodName = `${target.constructor.name}#${String(propertyKey)}`;

    const transformedOptions: AsyncApiOperationOptionsRaw[] = options.map(
      (i) => {
        const message = Array.isArray(i.message)
          ? {
              oneOf: i.message.map((m, index) =>
                makeMessage(m, `${methodName}#${index}`),
              ),
            }
          : makeMessage(i.message, methodName);

        return {
          ...i,
          message,
        };
      },
    );

    return createMethodDecorator(metaKey, transformedOptions)(
      target,
      propertyKey,
      descriptor,
    );
  };
}
