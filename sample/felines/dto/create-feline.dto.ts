import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Cat, Lion, Message, Tiger } from '../class';

type AllFelines = Cat | Lion | Tiger;

export class CreateFelineDto extends Message<AllFelines> {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(Cat) },
      { $ref: getSchemaPath(Lion) },
      { $ref: getSchemaPath(Tiger) },
    ],
  })
  payload: Cat | Lion | Tiger;
}
