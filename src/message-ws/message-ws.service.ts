import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

import { ConnectedClients } from './interfaces/connected-clients.interfaces';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MessageWsService {

    private connectedClients: ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user || !user.isActive)
            throw new Error('User not found or Uer not active');
        this.checkUserConnection(user);
        this.connectedClients[client.id] = {
            socket: client,
            user
        };
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        // console.log(this.connectedClients);
        return Object.keys(this.connectedClients);
    }

    //Método que devuelve el número de clientes conectados en el servidor
    // getConnectedClients(): number {
    //     return Object.keys(this.connectedClients).length;
    // }

    getUserFullName(socketId: string) {
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserConnection(user: User) {
        for (const clientId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[clientId];
            if (connectedClient.user.id === user.id) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }

}
