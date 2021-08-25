import { AsyncAPIObject, AsyncChannelObject, AsyncOperationObject } from '@lib';

export interface DenormalizedDoc extends Partial<AsyncAPIObject> {
  root?: { name: string } & AsyncChannelObject;
  operations?: { pub: AsyncOperationObject; sub: AsyncOperationObject };
}
