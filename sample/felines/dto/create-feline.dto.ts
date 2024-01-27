import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Cat, Feline, Lion, Message, Tiger } from '../class';

export class CreateFelineDto extends Message<Feline> {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(Cat) },
      { $ref: getSchemaPath(Lion) },
      { $ref: getSchemaPath(Tiger) },
    ],
  })
  payload: Feline;
}
