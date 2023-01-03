import { Type } from '@nestjs/common';

export type AsyncOperationPayload =
  | Type<unknown>
  | Function
  | [Function]
  | string;
