import { createMethodDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import { DECORATORS } from '../asyncapi.constants';
import { AsyncApiOperationOptions, AsyncOperationObject } from '../interface';

export function AsyncApiOperation(
  ...options: AsyncApiOperationOptions[]
): MethodDecorator {
  return (target, propertyKey: string | symbol, descriptor) => {
    const defaultMessageName = `${target.constructor.name}#${String(
      propertyKey,
    )}`;

    const transformedOptions: AsyncOperationObject[] = options.map((i) => {
      const transformedOptionInstance = {
        ...i,
        message: {
          ...i.message,
          name: i.name || defaultMessageName,
          payload: {
            type: i.payload,
          },
          headers: i.headers
            ? {
                type: 'object',
                properties: Object.entries(i.headers)
                  .map(([key, value]) => ({
                    [key]: {
                      type: 'string',
                      ...value,
                    },
                  }))
                  .reduce((acc, j) => ({ ...acc, ...j }), {}),
              }
            : undefined,
        },
        name: undefined,
        headers: undefined,
        payload: undefined,
      };

      // delete transformedOptionInstance.name;
      // delete transformedOptionInstance.headers;
      // delete transformedOptionInstance.payload;

      return transformedOptionInstance;
    });

    return createMethodDecorator(
      DECORATORS.AsyncApiOperation,
      transformedOptions,
    )(target, propertyKey, descriptor);
  };
}
