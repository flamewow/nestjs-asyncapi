/**
 * @see https://github.com/asyncapi/html-template#supported-parameters
 **/
export interface AsyncApiTemplateOptions {
  /** @default byTagsNoRoot **/
  sidebarOrganization?: 'byTags' | 'byTagsNoRoot';
  /**
   * @example /docs
   **/
  baseHref?: string;
  /** @default true **/
  singleFile?: boolean;
  /** @example asyncapi.html **/
  outFilename?: string;
  /**
   * @description Generates output HTML as PDF
   * @default false
   */
  pdf?: boolean;
  /** Timeout in ms when generating PDF. @default 30000 */
  pdfTimeout?: number;
  /** URL or path of the favicon. */
  favicon?: string;
  /**
   * Stringified JSON or path to a JSON file to override the default
   * React component config (merged via JSON Merge Patch).
   */
  config?: string;
  /**
   * Override the version displayed in the generated docs.
   * Defaults to `info.version` from the spec.
   */
  version?: string;
}
