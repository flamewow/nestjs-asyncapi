import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsGateway } from './cats.gateway';
import { CatsController } from './cats.controller';

@Module({
  providers: [CatsService, CatsGateway],
  controllers: [CatsController],
})
export class CatsModule {}
