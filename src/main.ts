import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser('token'))
  app.enableCors({ origin: '*' })

  const config = new DocumentBuilder()
    .addCookieAuth('token')
    .setTitle('Ig Scrape')
    .setDescription('India gyaan')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT || 5000)

  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
