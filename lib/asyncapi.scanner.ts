import { INestApplicationContext, Type } from '@nestjs/common';
import { MODULE_PATH } from '@nestjs/common/constants';
import { Injectable } from '@nestjs/common/interfaces';
import { NestContainer } from '@nestjs/core/injector/container';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { InstanceToken, Module } from '@nestjs/core/injector/module';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor';
import { SchemaObjectFactory } from '@nestjs/swagger/dist/services/schema-object-factory';
import { SwaggerTypesMapper } from '@nestjs/swagger/dist/services/swagger-types-mapper';
import { stripLastSlash } from '@nestjs/swagger/dist/utils/strip-last-slash.util';
import { flatten, isEmpty } from 'lodash';
import { AsyncApiDocumentOptions } from './asyncapi.module';
import { AsyncapiTransformer } from './asyncapi.transformer';
import { DenormalizedDoc } from './interfaces';
import { AsyncApiExplorer, AsyncAPIObject } from './index';

export class AsyncapiScanner {
  private readonly transformer = new AsyncapiTransformer();
  private readonly explorer = new AsyncApiExplorer();
  private readonly modelPropertiesAccessor = new ModelPropertiesAccessor();
  private readonly swaggerTypesMapper = new SwaggerTypesMapper();
  private readonly schemaObjectFactory = new SchemaObjectFactory(
    this.modelPropertiesAccessor,
    this.swaggerTypesMapper,
  );

  public scanApplication(
    app: INestApplicationContext,
    options: AsyncApiDocumentOptions,
  ): Omit<AsyncAPIObject, 'asyncapi' | 'info'> {
    const {
      deepScanRoutes,
      include: includedModules = [],
      extraModels = [],
      ignoreGlobalPrefix = false,
      operationIdFactory,
    } = options;

    const container: NestContainer = (app as any).container;
    const modules: Module[] = this.getModules(
      container.getModules(),
      includedModules,
    );
    const globalPrefix = !ignoreGlobalPrefix
      ? stripLastSlash(this.getGlobalPrefix(app))
      : '';

    const denormalizedChannels = modules.reduce(
      (channels, { components, metatype, relatedModules, routes }) => {
        let allComponents = new Map([...components, ...routes]);

        if (deepScanRoutes) {
          // only load submodules routes if asked
          const isGlobal = (module: Type<any>) =>
            !container.isGlobalModule(module);

          Array.from(relatedModules.values())
            .filter(isGlobal as any)
            .map(
              ({ components: relatedComponents, routes: relatedRoutes }) => ({
                relatedComponents,
                relatedRoutes,
              }),
            )
            .forEach(({ relatedComponents, relatedRoutes }) => {
              allComponents = new Map([
                ...allComponents,
                ...relatedComponents,
                ...relatedRoutes,
              ]);
            });
        }
        const path = metatype
          ? Reflect.getMetadata(MODULE_PATH, metatype)
          : undefined;

        return [
          ...channels,
          ...this.scanModuleComponents(
            allComponents,
            path,
            globalPrefix,
            operationIdFactory,
          ),
        ];
      },
      [],
    );

    const schemas = this.explorer.getSchemas();
    this.addExtraModels(schemas, extraModels);
    const normalizedChannels = this.transformer.normalizeChannels(
      flatten(denormalizedChannels),
    );
    return {
      ...normalizedChannels,
      components: { schemas },
    };
  }

  private scanModuleComponents(
    components: Map<InstanceToken, InstanceWrapper<Injectable>>,
    modulePath?: string,
    globalPrefix?: string,
    operationIdFactory?: (controllerKey: string, methodKey: string) => string,
  ): DenormalizedDoc[] {
    const denormalizedArray = [...components.values()].reduce(
      (denormalized, comp) => {
        const object = this.explorer.explorerAsyncapiServices(
          comp,
          modulePath,
          globalPrefix,
          operationIdFactory,
        );
        return [...denormalized, ...object];
      },
      [],
    );

    return flatten(denormalizedArray) as any;
  }

  private getModules(
    modulesContainer: Map<string, Module>,
    include: Function[],
  ): Module[] {
    if (!include || isEmpty(include)) {
      return [...modulesContainer.values()];
    }
    return [...modulesContainer.values()].filter(({ metatype }) =>
      include.some((item) => item === metatype),
    );
  }

  private getGlobalPrefix(app: INestApplicationContext): string {
    const internalConfigRef = (app as any).config;
    return (internalConfigRef && internalConfigRef.getGlobalPrefix()) || '';
  }

  private addExtraModels(
    schemas: Record<string, SchemaObject>,
    extraModels: Function[],
  ) {
    extraModels.forEach((item) => {
      this.schemaObjectFactory.exploreModelSchema(item, schemas);
    });
  }
}
