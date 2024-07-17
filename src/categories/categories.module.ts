import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { PrismaService } from 'src/prisma.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
  imports: [JwtModule.register({})],
})
export class CategoriesModule {}
