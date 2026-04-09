import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { writeFileSync } from 'node:fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('NestHub API')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2))
  SwaggerModule.setup('docs', app, document)

  await app.listen(process.env.PORT ?? 8000)
}
bootstrap()
