import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import * as userAgent from 'express-useragent'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.use(cookieParser())
  app.use(userAgent.express())
  await app.listen(5000)
}
bootstrap()
