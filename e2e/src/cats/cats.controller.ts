import { Controller, Logger } from '@nestjs/common';
import { AsyncApiPub, AsyncApiService } from '../../../lib';
import { AsyncApiSub } from '../../../lib/decorators/asyncapi-operation.decorator';
import { CreateCatCommand } from './async/messages';

@AsyncApiService()
@Controller()
export class CatsController {
  private logger: Logger = new Logger(CatsController.name);

  @AsyncApiSub({
    channel: 'test-controller',
    summary: 'Subscribe to events on this topic',
    description: 'method is used for test purposes',
    message: {
      name: 'test event',
      payload: {
        type: CreateCatCommand,
      },
    },
  })
  async handleRequestResponse() {
    this.logger.log(`received event`);
  }
}
