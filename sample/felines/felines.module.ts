import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FELINES_MS } from './felines.constants';
import { FelinesController } from './felines.controller';
import { FelinesGateway } from './felines.gateway';
import { FelinesService } from './felines.service';

@Module({
  imports: [
    ClientsModule.register([{ name: FELINES_MS, transport: Transport.TCP }]),
  ],
  providers: [FelinesService, FelinesGateway],
  controllers: [FelinesController],
})
export class FelinesModule {}
