import { Type } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { DECORATORS } from './index';
import { exploreAsyncapiPubMetadata, exploreAsyncapiServiceMetadata, exploreAsyncapiSubMetadata } from './explorers';
import { DenormalizedDocResolvers, DenormalizedDoc } from './interfaces';
import { flatten } from 'lodash';

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
      operations: [exploreAsyncapiPubMetadata, exploreAsyncapiSubMetadata],
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
    const denormalizedAsyncapiServices = this.metadataScanner.scanFromPrototype<any, DenormalizedDoc[]>(instance, prototype, (name) => {
      const targetCallback = prototype[name];
      const methodMetadata = documentResolvers.root.reduce((_metadata, fn) => {
        const serviceMetadata = fn(metatype);

        const channels = documentResolvers.operations.reduce((operations, exploreOperationsMeta) => {
          const meta = exploreOperationsMeta(this.schemas, instance, prototype, targetCallback);
          if (!meta) {
            return operations;
          }

          meta.forEach((op) => {
            if (operations.hasOwnProperty(op.channel)) {
              operations[op.channel] = { ...operations[op.channel], ...op };
            } else {
              operations[op.channel] = op;
            }
          });
          return operations;
        }, {});

        return Object.keys(channels).map((channel) => ({
          root: { ...serviceMetadata, name: channel },
          operations: channels[channel],
        }));

        // const pubs = documentResolvers.operations[0](this.schemas, instance, prototype, targetCallback);
        // const subs = documentResolvers.operations[1](this.schemas, instance, prototype, targetCallback);

        // if (!pubs) {
        //   if (!subs) {
        //     return [];
        //   }

        //   return [subs.map(())
        //     {
        //       root: { ...serviceMetadata, name: sub.channel },
        //       operations: { ...sub },
        //     },
        //   ];
        // }

        // if (!sub || pub.channel === sub.channel) {
        //   return [
        //     {
        //       root: { ...serviceMetadata, name: pub.channel },
        //       operations: { ...pub, ...sub },
        //     },
        //   ];
        // } else {
        //   return [
        //     {
        //       root: { ...serviceMetadata, name: pub.channel },
        //       operations: { ...pub },
        //     },
        //     {
        //       root: { ...serviceMetadata, name: sub.channel },
        //       operations: { ...sub },
        //     },
        //   ];
        // }
      }, []);
      return methodMetadata;
    });

    return flatten(denormalizedAsyncapiServices);
  }
}
