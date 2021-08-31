import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { BreadCoonDto, BritishShorthairCatDto, MaineCoonDto } from './bread-cat.dto';
import { LettersEnum } from './pagination-query.dto';
import { TagDto } from './tag.dto';

export class CreateCatDto {
  readonly name: string;

  @ApiProperty({ minimum: 1, maximum: 200 })
  readonly age: number;

  @ApiProperty({
    name: '_breed',
    type: BreadCoonDto,
  })
  readonly breed: BreadCoonDto;

  readonly tags?: string[];

  createdAt: Date;

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  readonly urls?: string[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        isReadonly: {
          type: 'string',
        },
      },
    },
  })
  readonly options?: Record<string, any>[];

  readonly enum: LettersEnum;

  readonly enumArr: LettersEnum[];

  @ApiProperty({ description: 'tag', required: false })
  readonly tag: TagDto;
}
