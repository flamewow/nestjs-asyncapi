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
   * @description 	Generates output HTML as PDF
   * @default false
   */
  pdf?: boolean;
}
