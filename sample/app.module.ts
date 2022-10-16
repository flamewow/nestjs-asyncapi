import { Module } from '@nestjs/common';
import { FelinesModule } from './felines/felines.module';

@Module({
  imports: [FelinesModule],
})
export class AppModule {}
