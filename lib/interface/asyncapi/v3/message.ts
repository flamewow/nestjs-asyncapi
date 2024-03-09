import { ExternalDocs } from './external.docs';
import { MessageExample } from './message-example';
import { MessageBindings } from './message.bindings';
import { Ref } from './ref';
import { SchemaObject } from './schema-object';
import { Tag } from './tag';

export interface Message {
  headers: SchemaObject | Ref;
  payload: SchemaObject | Ref;
  correlationId: string | Ref;
  contentType: string;
  name: string;
  title: string;
  summary: string;
  description: string;
  tags: Tag[];
  externalDocs: ExternalDocs | Ref;
  bindings: MessageBindings | Ref;
  examples: MessageExample[];
}
