/* eslint-disable @typescript-eslint/ban-types */
/**
 * Options for AsyncApi Module (kept similar with Swagger module)
 */
export interface AsyncApiScanningOptions {
  /**
   * List of modules to include in the specification
   */
  include?: Function[];

  /**
   * If `true`, asyncapi will also load routes from the modules imported by `include` modules
   */
  deepScanRoutes?: boolean;

  /**
   * Custom operationIdFactory that will be used to generate the `operationId`
   * based on the `controllerKey` and `methodKey`
   * @default () => controllerKey_methodKey
   */
  operationIdFactory?: (controllerKey: string, methodKey: string) => string;
}
