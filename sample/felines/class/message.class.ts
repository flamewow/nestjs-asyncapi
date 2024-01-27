import { ApiProperty } from '@nestjs/swagger';

export abstract class Message<T extends Record<string, any>> {
  @ApiProperty({ format: 'uuid' })
  correlationId: string;

  @ApiProperty({ format: 'x.y.z', example: '1.0.1' })
  version: string;

  timestamp: Date;

  abstract payload: T;

  constructor(partialData: Partial<Message<T>>) {
    Object.assign(this, partialData);
  }
}
