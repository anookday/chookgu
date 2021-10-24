import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PlayersModule } from '@players/players.module'
import { PortfoliosService } from '@portfolios/portfolios.service'
import { PortfoliosController } from '@portfolios/portfolios.controller'
import {
  Portfolio,
  PortfolioSchema,
} from '@portfolios/schemas/portfolio.schema'
import { TransactionsModule } from '@transactions/transactions.module'
import {
  Transaction,
  TransactionSchema,
} from '@transactions/schemas/transaction.schema'
import { UsersModule } from '@users/users.module'

@Module({
  imports: [
    PlayersModule,
    UsersModule,
    TransactionsModule,
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [PortfoliosService],
  controllers: [PortfoliosController],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
