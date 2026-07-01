/**
 * Metadata-decorator helpers inlined verbatim from `@nestjs/swagger`'s internal
 * `dist/decorators/helpers` module.
 *
 * We inline them (rather than deep-importing) because `@nestjs/swagger@>=11.4.3`
 * ships a strict `exports` map that blocks `@nestjs/swagger/dist/decorators/helpers`
 * with `ERR_PACKAGE_PATH_NOT_EXPORTED`. The behaviour here is a faithful copy of the
 * swagger helpers so decorator semantics are unchanged.
 *
 * Tracking issue: https://github.com/flamewow/nestjs-asyncapi/issues/596
 */

export function createMethodDecorator(
  metakey: string,
  metadata: any,
  { overrideExisting }: { overrideExisting?: boolean } = {
    overrideExisting: true,
  },
): MethodDecorator {
  return (_target, _key, descriptor: PropertyDescriptor) => {
    if (typeof metadata === 'object') {
      const prevValue = Reflect.getMetadata(metakey, descriptor.value);
      if (prevValue && !overrideExisting) {
        return descriptor;
      }
      Reflect.defineMetadata(
        metakey,
        { ...prevValue, ...metadata },
        descriptor.value,
      );
      return descriptor;
    }
    Reflect.defineMetadata(metakey, metadata, descriptor.value);
    return descriptor;
  };
}

export function createMixedDecorator(
  metakey: string,
  metadata: any,
): MethodDecorator & ClassDecorator {
  return (target: object, _key?: any, descriptor?: PropertyDescriptor): any => {
    if (descriptor) {
      let metadatas: any;
      if (Array.isArray(metadata)) {
        const previousMetadata =
          Reflect.getMetadata(metakey, descriptor.value) || [];
        metadatas = [...previousMetadata, ...metadata];
      } else {
        const previousMetadata =
          Reflect.getMetadata(metakey, descriptor.value) || {};
        metadatas = { ...previousMetadata, ...metadata };
      }
      Reflect.defineMetadata(metakey, metadatas, descriptor.value);
      return descriptor;
    }
    let metadatas: any;
    if (Array.isArray(metadata)) {
      const previousMetadata = Reflect.getMetadata(metakey, target) || [];
      metadatas = [...previousMetadata, ...metadata];
    } else {
      const previousMetadata = Reflect.getMetadata(metakey, target) || {};
      metadatas = { ...previousMetadata, ...metadata };
    }
    Reflect.defineMetadata(metakey, metadatas, target);
    return target;
  };
}
