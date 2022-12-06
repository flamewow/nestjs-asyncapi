import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';
import { Socket } from 'socket.io-client';
import { FelinesService } from './/felines.service';
import { CreateFelineDto } from './dto';
import { FelineRto } from './rto';
import { AsyncApiPub, AsyncApiSub } from '#lib';

const EventPatternsWS = {
  createFeline: 'ws/create/feline',
};

/**
 * How to use AsyncApi in a websockets
 */
@WebSocketGateway({ transports: ['websocket'], namespace: 'ws' })
export class FelinesGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger: Logger = new Logger(FelinesGateway.name);

  constructor(private readonly felinesService: FelinesService) {}

  afterInit(nsp: Namespace) {
    this.logger.log(`Gateway server init: ${nsp?.name}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(EventPatternsWS.createFeline)
  @AsyncApiPub({
    channel: EventPatternsWS.createFeline,
    payload: CreateFelineDto,
  })
  async createFeline(
    @ConnectedSocket() client: Socket,
    @MessageBody() createFelineDto: CreateFelineDto,
  ) {
    this.logger.log(
      `data from client ${client.id} : ${JSON.stringify(createFelineDto)}`,
    );

    const feline = await this.felinesService.create(createFelineDto);
    await this.emitCreatedFeline(new FelineRto(feline));
  }

  @AsyncApiSub({
    channel: EventPatternsWS.createFeline,
    payload: FelineRto,
  })
  async emitCreatedFeline(felineRto: FelineRto) {
    this.server.emit(EventPatternsWS.createFeline, felineRto);
  }
}
