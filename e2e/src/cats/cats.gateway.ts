import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io-client';
import { CreateCatCommand } from './async/messages';
import { AsyncApiPub, AsyncApiService, AsyncApiSub } from '../../../lib';

@AsyncApiService()
@WebSocketGateway({ transports: ['websocket'], namespace: 'cats-ws' })
export class CatsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger(CatsGateway.name);

  afterInit(nsp: Namespace) {
    this.logger.log(`WS server init: ${nsp?.name}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`IOClient disconnected: ${client.id}`);
  }

  @SubscribeMessage('test')
  @AsyncApiPub({
    channel: 'test',
    summary: 'Send test packet',
    description: 'method is used for test purposes',
    message: {
      name: 'test data',
      payload: {
        type: String,
      },
    },
  })
  test(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    this.logger.log(`data from client ${client.id} : ${JSON.stringify(data)}`);
    this.server.emit('test', data);
  }

  @AsyncApiSub({
    channel: 'signal',
    summary: 'Subscribe to signal packet',
    description: 'method is used for test purposes',
    message: {
      name: 'test data signal',
      payload: {
        type: CreateCatCommand,
      },
    },
  })
  async emitSignal(boardUUID: string, data: Record<string, any>) {
    this.server.to('test').emit('signal', data);
  }
}
