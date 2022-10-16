import { Module } from '@nestjs/common';
import { FelinesController } from './felines.controller';
import { FelinesGateway } from './felines.gateway';
import { FelinesService } from './felines.service';

@Module({
  providers: [FelinesService, FelinesGateway],
  controllers: [FelinesController],
})
export class FelinesModule {}
