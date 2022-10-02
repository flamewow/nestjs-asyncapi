import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty({ description: 'name' })
  name: string;
}
