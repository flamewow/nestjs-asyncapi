/**
 * Loader for `@nestjs/swagger` schema-generation classes that are used at runtime
 * but are NOT part of swagger's public API.
 *
 * Since `@nestjs/swagger@11.4.3` the package ships a strict `exports` map that only
 * exposes `.`, `./plugin` and `./package.json`. That blocks bare deep-imports such
 * as `@nestjs/swagger/dist/services/schema-object-factory`, which now throw
 * `ERR_PACKAGE_PATH_NOT_EXPORTED` at require time.
 *
 * These classes (`SchemaObjectFactory`, `ModelPropertiesAccessor`,
 * `SwaggerTypesMapper`) are the engine that turns a decorated DTO class into a JSON
 * schema, and swagger exposes no public replacement (only the full
 * `SwaggerModule.createDocument` pipeline). To keep using swagger's own engine —
 * and avoid vendoring hundreds of lines that would drift between versions — we
 * resolve swagger's install directory via its (always-exported) `package.json` and
 * load the internal modules by absolute file path. Absolute-path `require`s are not
 * subject to the `exports` gate, so this works on every swagger major in our peer
 * range (v7 / v8 / v11, including >=11.4.3).
 *
 * Type-only `import type` deep-imports below are erased at compile time (classic
 * `node` module resolution ignores `exports`), so they add types without any
 * runtime deep-import.
 *
 * Tracking issue: https://github.com/flamewow/nestjs-asyncapi/issues/596
 */
import { dirname, join } from 'path';

type ModelPropertiesAccessorCtor =
  typeof import('@nestjs/swagger/dist/services/model-properties-accessor').ModelPropertiesAccessor;
type SchemaObjectFactoryCtor =
  typeof import('@nestjs/swagger/dist/services/schema-object-factory').SchemaObjectFactory;
type SwaggerTypesMapperCtor =
  typeof import('@nestjs/swagger/dist/services/swagger-types-mapper').SwaggerTypesMapper;

// `./package.json` is always exposed by swagger's `exports` map, so this resolves
// on every version and gives us the package root to reach the internal `dist/`.
const swaggerDist = join(
  dirname(require.resolve('@nestjs/swagger/package.json')),
  'dist',
);

const loadInternal = (relativePath: string): any =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(join(swaggerDist, relativePath));

export const ModelPropertiesAccessor: ModelPropertiesAccessorCtor =
  loadInternal('services/model-properties-accessor').ModelPropertiesAccessor;

export const SchemaObjectFactory: SchemaObjectFactoryCtor = loadInternal(
  'services/schema-object-factory',
).SchemaObjectFactory;

export const SwaggerTypesMapper: SwaggerTypesMapperCtor = loadInternal(
  'services/swagger-types-mapper',
).SwaggerTypesMapper;
