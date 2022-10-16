import { ApiProperty } from '@nestjs/swagger';
import { Feline } from './feline.class';

export class Cat extends Feline {
  @ApiProperty({
    example: 'Maine Coon',
  })
  breed: string;
}
