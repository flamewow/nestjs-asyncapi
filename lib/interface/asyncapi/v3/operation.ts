import { TODO } from '../../../utility';
import { ExternalDocs } from './external.docs';
import { Ref } from './ref';
import { Tag } from './tag';

export interface Operation {
  action: 'send' | 'receive';
  channel: Ref;
  title?: string;
  summary?: string;
  description?: string;
  security?: TODO;
  tags?: Tag[];
  externalDocs?: ExternalDocs | Ref;
  traits?: TODO[];
  messages?: Ref[];
  reply?: Ref;
}
