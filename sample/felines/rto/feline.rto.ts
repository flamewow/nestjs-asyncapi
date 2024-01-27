import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Cat, Feline, Lion, Message, Tiger } from '../class';

export class FelineRto extends Message<Feline> {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(Cat) },
      { $ref: getSchemaPath(Lion) },
      { $ref: getSchemaPath(Tiger) },
    ],
  })
  payload: Feline;
}

export class FelineExtendedRto extends FelineRto {
  extra: string;
}
