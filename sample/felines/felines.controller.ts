import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { CreateFelineDto } from './dto';
import { AsyncApiPub, AsyncApiSub } from '#lib';
import { Cat, Feline } from '#sample/felines/class';
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
    message: {
      payload: JournalingDataDto,
    },
  })
  @EventPattern(EventPatternsMS.journal)
  async journal(dataForJournaling: JournalingDataDto) {
    const dataForJournalingString = JSON.stringify(dataForJournaling, null, 4);
    this.logger.log(`journaling:\n${dataForJournalingString}`);
  }

  @AsyncApiPub({
    channel: EventPatternsMS.createFeline,
    message: {
      payload: CreateFelineDto,
    },
  })
  @AsyncApiSub({
    channel: EventPatternsMS.createFeline,
    message: {
      payload: FelineRto,
    },
  })
  @EventPattern(EventPatternsMS.createFeline)
  async createFeline(createFelineDto: CreateFelineDto) {
    const feline = await this.felinesService.create(createFelineDto);
    this.logger.debug(`feline created:\n${JSON.stringify(feline)}`);
    this.publishCreatedFeline(feline);
  }

  publishCreatedFeline(feline: Feline) {
    const felineRto = new FelineRto({ payload: feline });
    return this.client.emit(EventPatternsMS.journal, felineRto);
  }

  @Get()
  async do() {
    const cat = new Cat({
      id: 123,
      name: 'demo',
    });

    const felineRto = new CreateFelineDto({ payload: cat });

    await this.createFeline(felineRto);
  }
}
