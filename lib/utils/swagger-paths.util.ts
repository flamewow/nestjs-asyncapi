/**
 * Tiny path helpers inlined verbatim from `@nestjs/swagger`'s internal
 * `dist/utils` modules.
 *
 * We inline them instead of deep-importing because `@nestjs/swagger@>=11.4.3`
 * ships a strict `exports` map that only exposes `.`, `./plugin` and
 * `./package.json`. Any bare deep-import such as
 * `@nestjs/swagger/dist/utils/validate-path.util` therefore fails at runtime with
 * `ERR_PACKAGE_PATH_NOT_EXPORTED`. These utilities are trivial and stable, so a
 * verbatim copy is the safest fix.
 *
 * Tracking issue: https://github.com/flamewow/nestjs-asyncapi/issues/596
 */

/** Ensure a route path starts with a leading slash. */
export const validatePath = (inputPath: string): string =>
  inputPath.charAt(0) !== '/' ? '/' + inputPath : inputPath;

/** Remove a single trailing slash, if present. */
export const stripLastSlash = (path: string): string =>
  path && path[path.length - 1] === '/' ? path.slice(0, path.length - 1) : path;
