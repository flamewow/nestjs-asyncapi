import { ApiProperty } from '@nestjs/swagger';

export class ExtraModel {
  @ApiProperty()
  readonly one: string;

  @ApiProperty()
  readonly two: number;
}
