import { Module } from '@nestjs/common'
import { ArticlesService } from './articles.service'
import { ScrapeController } from './articles.controller'
import { PrismaService } from 'src/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { ScrapeFunctions } from 'src/articles/scrape.functions'
import { SocketGateway } from 'src/socket/socket.gateway'
import { CustomWinstonLogger } from 'src/custom-winston-logger/custom-winston-logger'

@Module({
  controllers: [ScrapeController],
  providers: [SocketGateway, PrismaService, JwtService, ArticlesService, ScrapeFunctions, CustomWinstonLogger],
})
export class ScrapeModule {}
