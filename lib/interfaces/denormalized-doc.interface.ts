import { AsyncAPIObject, AsyncChannelObject, AsyncOperationObject } from '..';

export interface DenormalizedDoc extends Partial<AsyncAPIObject> {
  root?: { name: string } & AsyncChannelObject;
  operations?: { pub: AsyncOperationObject; sub: AsyncOperationObject };
}
