import { Message } from '../class';

export class JournalingDataDto extends Message<Record<string, unknown>> {
  payload: Record<string, unknown>;
}
