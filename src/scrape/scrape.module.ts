import { Module } from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { ScrapeController } from './scrape.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ScrapeFunctions } from 'src/scrape/scrape.functions';
import { SocketGateway } from 'src/socket/socket.gateway';
import { CustomWinstonLogger } from 'src/custom-winston-logger/custom-winston-logger';

@Module({
  controllers: [ScrapeController],
  providers: [
    SocketGateway,
    PrismaService,
    JwtService,
    ScrapeService,
    ScrapeFunctions,
    CustomWinstonLogger,
  ],
})
export class ScrapeModule {}
