import 'dotenv/config'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PlayersModule } from '@players/players.module'
import { AuthModule } from '@auth/auth.module'
import { UsersModule } from '@users/users.module'
import { TransactionsModule } from '@transactions/transactions.module'
import { PortfoliosModule } from './portfolios/portfolios.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    PlayersModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    PortfoliosModule,
  ],
})
export class AppModule {}
