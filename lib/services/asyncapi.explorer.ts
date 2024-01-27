import { Type } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { flatten } from 'lodash';
import {
  asyncApiClassAnnotationLabels,
  exploreAsyncapiClassMetadata,
  exploreAsyncApiOperationMetadata,
  exploreControllerMetadata,
  exploreGatewayMetadata,
} from '../explorers';
import { DenormalizedDoc, DenormalizedDocResolvers } from '../interface';

export class AsyncApiExplorer {
  private readonly metadataScanner = new MetadataScanner();
  private readonly schemas: SchemaObject[] = [];
  private readonly schemaRefsStack: string[] = [];

  private operationIdFactory = (controllerKey: string, methodKey: string) =>
    controllerKey ? `${controllerKey}_${methodKey}` : methodKey;

  public explorerAsyncapiServices(
    wrapper: InstanceWrapper,
    modulePath?: string,
    globalPrefix?: string,
    operationIdFactory?: (controllerKey: string, methodKey: string) => string,
  ) {
    if (operationIdFactory) {
      this.operationIdFactory = operationIdFactory;
    }

    const { instance, metatype } = wrapper;
    if (
      !instance ||
      !metatype ||
      !Reflect.getMetadataKeys(metatype).find((label) =>
        asyncApiClassAnnotationLabels.includes(label),
      )
    ) {
      return [];
    }

    const prototype = Object.getPrototypeOf(instance);
    const documentResolvers: DenormalizedDocResolvers = {
      root: [
        exploreAsyncapiClassMetadata,
        exploreControllerMetadata,
        exploreGatewayMetadata,
      ],
      security: [],
      tags: [],
      operations: [exploreAsyncApiOperationMetadata],
    };

    return this.generateDenormalizedDocument(
      metatype as Type<unknown>,
      prototype,
      instance,
      documentResolvers,
      modulePath,
      globalPrefix,
    );
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
    const denormalizedAsyncapiServices = this.metadataScanner.scanFromPrototype<
      unknown,
      DenormalizedDoc[]
    >(instance, prototype, (name) => {
      const targetCallback = prototype[name];
      const methodMetadata = documentResolvers.root.reduce((_metadata, fn) => {
        const serviceMetadata = fn(metatype);

        const channels = documentResolvers.operations.reduce(
          (operations, exploreOperationsMeta) => {
            const meta = exploreOperationsMeta(
              this.schemas,
              instance,
              prototype,
              targetCallback,
            );
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
          },
          {},
        );

        return Object.keys(channels).map((channel) => ({
          root: { ...serviceMetadata, name: channel },
          operations: channels[channel],
        }));
      }, []);
      return methodMetadata;
    });

    return flatten(denormalizedAsyncapiServices);
  }
}
