import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PortfoliosService } from '@portfolios/portfolios.service'
import { PortfoliosController } from '@portfolios/portfolios.controller'
import {
  Portfolio,
  PortfolioSchema,
} from '@portfolios/schemas/portfolio.schema'
import {
  Transaction,
  TransactionSchema,
} from '@transactions/schemas/transaction.schema'

@Module({
  imports: [
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
