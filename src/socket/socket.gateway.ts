import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma.service';

@WebSocketGateway({
  cors: '*',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  socket: Socket;

  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  @SubscribeMessage('message')
  handleMessage(@MessageBody() payload: any) {
    this.socket.emit('message', payload);
  }

  emitMessage(event: string, message: string | Record<string, any>) {
    this.socket.emit(event, message);
  }

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization;
    if (!token) {
      client.emit('error', 'Unauthorized');
      client.disconnect();
      return;
    }

    this.jwtService
      .verifyAsync(token.split(' ')[1], {
        secret: this.configService.get<string>('JWT_SECRET'),
      })
      .then((value) => {
        if (value.role !== 'ADMIN') {
          client.emit('error', 'Unauthorized');
          client.disconnect();
          return;
        }
        console.log(`Client connected: ${client.id}`);
      })
      .catch((error) => {
        console.log(error);
        client.emit('error', 'Unauthorized');
        client.disconnect();
      });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
