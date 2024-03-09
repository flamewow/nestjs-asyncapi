import { ExternalDocs } from './external.docs';
import { Ref } from './ref';

export interface Tag {
  name: string;
  description: string;
  externalDocs: ExternalDocs | Ref;
}
