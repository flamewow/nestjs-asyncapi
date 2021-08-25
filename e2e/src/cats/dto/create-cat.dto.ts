import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { BreadCoonDto, BritishShorthairCatDto, MaineCoonDto } from './bread-cat.dto';
import { LettersEnum } from './pagination-query.dto';
import { TagDto } from './tag.dto';

export class CreateCatDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty({ minimum: 1, maximum: 200 })
  readonly age: number;

  @ApiProperty({
    name: '_breed',
    type: BreadCoonDto,
  })
  readonly breed: BreadCoonDto;

  @ApiProperty({
    type: [String],
  })
  readonly tags?: string[];

  @ApiProperty()
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

  @ApiProperty({
    enum: LettersEnum,
    enumName: 'LettersEnum',
  })
  readonly enum: LettersEnum;

  @ApiProperty({
    enum: LettersEnum,
    enumName: 'LettersEnum',
    isArray: true,
  })
  readonly enumArr: LettersEnum;

  @ApiProperty({ description: 'tag', required: false })
  readonly tag: TagDto;
}
