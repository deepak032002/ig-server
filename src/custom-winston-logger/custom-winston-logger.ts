import { Inject, Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import Transport from 'winston-transport';
import { SocketGateway } from 'src/socket/socket.gateway';
import { PrismaService } from 'src/prisma.service';
import { REQUEST } from '@nestjs/core';

class SocketTransport extends Transport {
  constructor(
    opts: winston.transport.TransportStreamOptions,
    private socketGateway: SocketGateway,
    private prisma: PrismaService,
  ) {
    super(opts);
  }

  log(info: any) {
    this.prisma.logs.create({
      data: {
        level: info.level,
        message: info.message,
        service: info.service,
        user: info.user,
      },
    });
    this.socketGateway.emitMessage('log', { ...info, date: new Date() });
  }
}

@Injectable({ scope: Scope.REQUEST })
export class CustomWinstonLogger {
  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  getLogger() {
    return winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: ' ig-service' },
      transports: [
        // new winston.transports.Console(),
        new SocketTransport({}, this.socketGateway, this.prisma),
      ],
    });
  }
}
