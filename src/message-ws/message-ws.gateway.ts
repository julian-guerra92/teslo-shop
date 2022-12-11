import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

import { MessageWsService } from './message-ws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() webSocketServer: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    // console.log({payload});
    // console.log('Client Connected', client.id);
    //Conecta el cliente al servidor
    //Emite a todos los clientes conectados en el servidor los clientes conectados
    this.webSocketServer.emit('clients-update', this.messageWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Disconneted Client', client.id);
    //Conecta el cliente al servidor
    this.messageWsService.removeClient(client.id);
    //Emite a todos los clientes conectados en el servidor los clientes conectados
    this.webSocketServer.emit('clients-update', this.messageWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {

    /* Comunicaciòn directa con el cliente que se comunicó con el servidor
    client.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'no-message!!'
    })
    */
    /* Emite a todos los clientes menos al que se comunicó con el servidor
    client.broadcast.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'no-message!!'
    })
    */
    this.webSocketServer.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    })

  }


}
