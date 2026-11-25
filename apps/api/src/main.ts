import 'dotenv/config'
import './common/decimal-json'
import { writeFileSync } from 'node:fs'
import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  // JSON logs, one object per line on stdout: Loki parses them with `| json`.
  // Request logs are written by ObservabilityModule in the same format.
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ json: true }),
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('NestHub API')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2))
  SwaggerModule.setup('docs', app, document)

  await app.listen(process.env.PORT ?? 8000)
}
void bootstrap()
