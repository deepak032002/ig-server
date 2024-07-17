import { Module } from '@nestjs/common'
import { TagsService } from './tags.service'
import { TagsController } from './tags.controller'
import { PrismaService } from 'src/prisma.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService],
  imports: [JwtModule.register({})],
})
export class TagsModule {}
