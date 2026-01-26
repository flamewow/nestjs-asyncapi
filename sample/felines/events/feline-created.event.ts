import { Feline } from '../class';

export class FelineCreatedEvent {
  constructor(public readonly feline: Feline) {}
}
