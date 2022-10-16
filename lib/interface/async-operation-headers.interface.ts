export interface AsyncOperationHeadersOut {
  type: 'object';
  properties: {
    [key: string]: {
      description: string;
      type: 'string';
      [key: string]: any;
    };
  };
}
