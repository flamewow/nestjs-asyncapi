import { Operation } from './operation';
import { Ref } from './ref';

export interface Operations {
  [operationId: string]: Operation | Ref;
}
