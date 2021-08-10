import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.use(cookieParser())
  app.enableCors({ origin: 'http://localhost:3000', credentials: true })
  await app.listen(5000)
}
bootstrap()
