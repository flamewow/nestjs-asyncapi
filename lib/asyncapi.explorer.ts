import { Type } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { DECORATORS } from './index';
import { exploreAsyncapiOperationMetadata, exploreAsyncapiServiceMetadata } from './explorers';
import { DenormalizedDocResolvers, DenormalizedDoc } from './interfaces';

export class AsyncApiExplorer {
  private readonly metadataScanner = new MetadataScanner();
  private readonly schemas: SchemaObject[] = [];
  private readonly schemaRefsStack: string[] = [];
  private operationIdFactory = (controllerKey: string, methodKey: string) => (controllerKey ? `${controllerKey}_${methodKey}` : methodKey);

  public explorerAsyncapiServices(
    wrapper: InstanceWrapper<any>,
    modulePath?: string,
    globalPrefix?: string,
    operationIdFactory?: (controllerKey: string, methodKey: string) => string,
  ) {
    if (operationIdFactory) {
      this.operationIdFactory = operationIdFactory;
    }

    const { instance, metatype } = wrapper;
    if (!instance || !metatype || !Reflect.getMetadataKeys(metatype).find((x) => x === DECORATORS.ASYNCAPI_SERVICE)) {
      return [];
    }

    const prototype = Object.getPrototypeOf(instance);
    const documentResolvers: DenormalizedDocResolvers = {
      root: [exploreAsyncapiServiceMetadata],
      security: [],
      tags: [],
      operations: [exploreAsyncapiOperationMetadata],
    };

    return this.generateDenormalizedDocument(metatype as Type<unknown>, prototype, instance, documentResolvers, modulePath, globalPrefix);
  }

  public getSchemas(): Record<string, SchemaObject> {
    const ret = { ...this.schemas } as unknown as Record<string, SchemaObject>;
    return ret;
  }

  private generateDenormalizedDocument(
    metatype: Type<unknown>,
    prototype: Type<unknown>,
    instance: object,
    documentResolvers: DenormalizedDocResolvers,
    _modulePath?: string,
    _globalPrefix?: string,
  ): DenormalizedDoc[] {
    const denormalizedAsyncapiServices = this.metadataScanner.scanFromPrototype<any, DenormalizedDoc>(instance, prototype, (name) => {
      const targetCallback = prototype[name];
      const methodMetadata = documentResolvers.root.reduce((_metadata, fn) => {
        const serviceMetadata = fn(metatype);

        const operations = documentResolvers.operations.reduce((_metadata2, fn2) => {
          return fn2(this.schemas, this.schemaRefsStack, instance, prototype, targetCallback);
        }, {});

        return {
          root: { ...serviceMetadata, name: operations.channel },
          operations,
        };
      }, {});
      return methodMetadata;
    });

    // console.table(denormalizedAsyncapiServices);
    return denormalizedAsyncapiServices;
  }
}
