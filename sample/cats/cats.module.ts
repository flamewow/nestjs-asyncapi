import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsGateway } from './cats.gateway';
import { CatsService } from './cats.service';

@Module({
  providers: [CatsService, CatsGateway],
  controllers: [CatsController],
})
export class CatsModule {}
