import {
  AsyncApiDocument,
  AsyncChannelObject,
  AsyncOperationObject,
} from './asyncapi-common.interfaces';

export interface DenormalizedDoc extends Partial<AsyncApiDocument> {
  root?: { name: string } & AsyncChannelObject;
  operations?: { pub: AsyncOperationObject; sub: AsyncOperationObject };
}
