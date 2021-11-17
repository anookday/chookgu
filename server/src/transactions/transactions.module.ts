import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Transaction,
  TransactionSchema,
} from '@transactions/schemas/transaction.schema'
import { TransactionsService } from '@transactions/transactions.service'
import { PlayersModule } from '@players/players.module'
import { UsersModule } from '@users/users.module'

@Module({
  imports: [
    PlayersModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
