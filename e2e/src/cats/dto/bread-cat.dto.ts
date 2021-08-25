import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BreadCoonDto {
  @ApiProperty()
  readonly name: string;
}

export class MaineCoonDto implements BreadCoonDto {
  @ApiProperty()
  readonly name: string;

  @ApiPropertyOptional()
  readonly weight: number;
}

export class BritishShorthairCatDto implements BreadCoonDto {
  @ApiProperty()
  readonly name: string;

  @ApiPropertyOptional()
  readonly height: number;
}
