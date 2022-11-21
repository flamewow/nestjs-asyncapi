import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { CreateFelineDto } from './dto';
import { AsyncApiPub, AsyncApiSub } from '#lib';
import { Feline } from '#sample/felines/class';
import { JournalingDataDto } from '#sample/felines/dto/journaling-data.dto';
import { FELINES_MS } from '#sample/felines/felines.constants';
import { FelinesService } from '#sample/felines/felines.service';
import { FelineRto } from '#sample/felines/rto';

const EventPatternsMS = {
  createFeline: 'ms/create/feline',
  journal: 'ms/journal',
};

/**
 * How to use AsyncApi in a microservices
 */
@Controller()
export class FelinesController {
  private logger: Logger = new Logger(FelinesController.name);

  constructor(
    @Inject(FELINES_MS)
    private readonly client: ClientProxy,
    private readonly felinesService: FelinesService,
  ) {}

  @AsyncApiSub({
    channel: EventPatternsMS.journal,
    payload: JournalingDataDto,
  })
  @EventPattern(EventPatternsMS.journal)
  async journal(dataForJournaling: JournalingDataDto) {
    const dataForJournalingString = JSON.stringify(dataForJournaling, null, 4);
    this.logger.log(`journaling:\n${dataForJournalingString}`);
  }

  @AsyncApiPub({
    channel: EventPatternsMS.createFeline,
    payload: CreateFelineDto,
  })
  @EventPattern(EventPatternsMS.createFeline)
  async createFeline(createFelineDto: CreateFelineDto) {
    const feline = await this.felinesService.create(createFelineDto);
    this.logger.debug(`feline created:\n${JSON.stringify(feline)}`);
    this.publishCreatedFeline(feline);
  }

  @AsyncApiSub({
    channel: EventPatternsMS.createFeline,
    payload: FelineRto,
  })
  publishCreatedFeline(feline: Feline) {
    const felineRto = new FelineRto(feline);
    return this.client.emit(EventPatternsMS.journal, felineRto);
  }
}
