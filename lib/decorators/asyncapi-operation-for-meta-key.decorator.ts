import { createMethodDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import {
  AsyncApiOperationHeaders,
  AsyncApiOperationOptions,
  AsyncMessageObject,
  AsyncOperationObject,
} from '../interface';
import { OneAsyncApiMessage } from '../interface/asyncapi-message.interface';

function makeHeaders(headers?: AsyncApiOperationHeaders) {
  return headers
    ? {
        type: 'object',
        properties: Object.entries(headers)
          .map(([key, value]) => ({
            [key]: {
              type: 'string',
              ...value,
            },
          }))
          .reduce((acc, j) => ({ ...acc, ...j }), {}),
      }
    : undefined;
}

function makeMessage(
  message: OneAsyncApiMessage,
  defaultName: string,
): AsyncMessageObject {
  return {
    ...message,
    name: message.name || defaultName,
    payload: {
      type: message.payload,
    },
    headers: makeHeaders(message.headers),
  };
}

export function AsyncApiOperationForMetaKey(
  metaKey: string,
  options: AsyncApiOperationOptions[],
): MethodDecorator {
  return (target, propertyKey: string | symbol, descriptor) => {
    const methodName = `${target.constructor.name}#${String(propertyKey)}`;

    const transformedOptions: AsyncOperationObject[] = options.map((i) => {
      const message = Array.isArray(i.message)
        ? {
            oneOf: i.message.map((i, index) =>
              makeMessage(i, `${methodName}#${index}`),
            ),
          }
        : makeMessage(i.message, methodName);

      const transformedOptionInstance = {
        ...i,
        message,
      };

      return transformedOptionInstance;
    });

    return createMethodDecorator(metaKey, transformedOptions)(
      target,
      propertyKey,
      descriptor,
    );
  };
}
