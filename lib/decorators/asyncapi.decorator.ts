import { createMethodDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import { AsyncapiMetadataType } from '../enums';
import { typeDecoratorsMap } from '../explorers';
import { AsyncApiOperationOptions } from '../interface';

function AsyncApi(
  metadataType: AsyncapiMetadataType,
  ...options: AsyncApiOperationOptions[]
): MethodDecorator {
  return (target, propertyKey: string | symbol, descriptor) => {
    const defaultMessageName = `${target.constructor.name}#${String(
      propertyKey,
    )}`;

    const transformedOptions = options.map((i) => {
      const transformedOptionInstance = {
        ...i,
        message: {
          name: i.name || defaultMessageName,
          payload: {
            type: i.type,
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
      };

      delete transformedOptionInstance.name;
      delete transformedOptionInstance.headers;
      delete transformedOptionInstance.type;

      return transformedOptionInstance;
    });

    return createMethodDecorator(
      typeDecoratorsMap[metadataType],
      transformedOptions,
    )(target, propertyKey, descriptor);
  };
}

export function AsyncApiPublish(...options: AsyncApiOperationOptions[]) {
  return AsyncApi(AsyncapiMetadataType.pub, ...options);
}

export function AsyncApiSubscribe(...options: AsyncApiOperationOptions[]) {
  return AsyncApi(AsyncapiMetadataType.sub, ...options);
}
