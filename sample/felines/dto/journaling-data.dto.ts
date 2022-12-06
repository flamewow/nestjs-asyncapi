import { Message } from '../class';

export class JournalingDataDto extends Message<Record<string, any>> {
  payload: Record<string, any>;
}
