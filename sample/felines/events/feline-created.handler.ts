import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FelineRto } from '../rto';
import { FelineCreatedEvent } from './feline-created.event';
import { AsyncApiPub } from '#lib';

@EventsHandler(FelineCreatedEvent)
export class FelineCreatedHandler implements IEventHandler<FelineCreatedEvent> {
  private readonly logger = new Logger(FelineCreatedHandler.name);

  @AsyncApiPub({
    channel: 'animal.created',
    description: 'Event published when a new feline is created',
    message: {
      payload: FelineRto,
    },
  })
  handle(event: FelineCreatedEvent) {
    this.logger.log(`Feline created: ${JSON.stringify(event.feline)}`);
    // Aquí se publicaría el evento a través de un message broker
    // Por ejemplo: this.messageBroker.publish('feline.created', event.feline);
  }
}
