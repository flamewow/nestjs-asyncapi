import { Controller, Logger } from '@nestjs/common';
import { CreateFelineDto } from './dto';
import { FelineRto } from './rto';
import { AsyncApiPublish, AsyncApiService, AsyncApiSubscribe } from '#lib';

@AsyncApiService({
  serviceName: 'controller',
  description: 'example of AsyncApiService decorator usage on Controller class',
})
@Controller()
export class FelinesController {
  private logger: Logger = new Logger(FelinesController.name);

  @AsyncApiSubscribe({
    channel: 'controller/demo/sub',
    type: CreateFelineDto,
  })
  async handleTestSub() {
    this.logger.log(`controller handling of the test sub`);
  }

  @AsyncApiPublish({
    channel: 'controller/demo/pub',
    type: FelineRto,
  })
  async handleTestPub(id: number) {
    this.logger.log(`controller handling of the test pub`);
  }
}
