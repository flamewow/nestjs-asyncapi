import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCatDto } from '../dto/create-cat.dto';

export class MessageBase<T extends Record<string, any>> {
  @ApiProperty({ format: 'uuid', description: 'Identify a flow' })
  correlationId: string;

  @ApiProperty({ format: 'uuid', description: 'Identify a request' })
  messageId?: string;

  @ApiProperty({ description: 'Type of message' })
  messageType: string;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;

  @ApiProperty({ format: 'X.Y.Z', description: 'Message Version' })
  version: string;

  @ApiProperty({ description: 'Message payload' })
  payload: T;
}

export class CreateCatCommand extends MessageBase<CreateCatDto[]> {
  @ApiProperty({ description: 'Message payload', type: CreateCatDto, isArray: true })
  payload: CreateCatDto[];
}

export class CreateCatReplyCommand extends MessageBase<any> {}

export class CreateCatReplySuccessCommandPayload {
  @ApiProperty({ format: 'uuid' })
  identifier: string;
}

export class CreateCatDtoSuccessEventPayload extends CreateCatDto {
  @ApiProperty({ format: 'uuid' })
  identifier: string;
}

export class CreateCatReplySuccessCommand extends MessageBase<CreateCatReplySuccessCommandPayload> {}

export class CreateCatReplyErrorCommandPayload {
  @ApiProperty()
  errorCode: string;
  @ApiProperty()
  errorMessage: string;
  @ApiPropertyOptional()
  errorDetails: any;
}

export class CreateCatReplyErrorCommand extends MessageBase<CreateCatReplyErrorCommandPayload> {}

export class CatCreatedEvent {
  @ApiProperty({ format: 'uuid', description: 'Identify a flow' })
  correlationId: string;

  @ApiProperty({ format: 'uuid', description: 'Identify a request' })
  messageId?: string;

  @ApiProperty({ description: 'Type of message' })
  messageType: string;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;

  @ApiProperty({ format: 'X.Y.Z', description: 'Message Version' })
  version: string;

  @ApiProperty({ description: 'Message payload' })
  payload: CreateCatDto;
}
