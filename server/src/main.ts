import * as helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import * as userAgent from 'express-useragent'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(helmet())
  app.use(cookieParser())
  app.use(userAgent.express())
  app.set('trust proxy', true)
  await app.listen(5000)
}
bootstrap()
