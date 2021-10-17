import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Transaction,
  TransactionSchema,
} from '@transactions/schemas/transaction.schema'
import { TransactionsController } from '@transactions/transactions.controller'
import { TransactionsService } from '@transactions/transactions.service'
import { PlayersModule } from '@players/players.module'
import { PortfoliosModule } from '@portfolios/portfolios.module'
import { UsersModule } from '@users/users.module'

@Module({
  imports: [
    PlayersModule,
    UsersModule,
    PortfoliosModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
