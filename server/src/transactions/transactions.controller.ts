import { Controller } from '@nestjs/common'
import { TransactionsService } from '@transactions/transactions.service'

@Controller('transaction')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}
}
