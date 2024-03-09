import { Message } from './message';
import { Ref } from './ref';

export interface Messages {
  [messageId: string]: Message | Ref;
}
