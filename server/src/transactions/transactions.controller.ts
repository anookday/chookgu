import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  Body,
  ValidationPipe,
} from '@nestjs/common'
import { TransactionsService } from '@transactions/transactions.service'
import { TransactionDto } from '@transactions/dto/transaction.dto'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { User } from '@users/user.decorator'

@Controller('transaction')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/buy')
  async buy(
    @User('_id') userId: string,
    @Body() { playerId, amount }: TransactionDto
  ) {
    console.log(amount, typeof amount)
    return await this.transactionsService.buyPlayer(userId, playerId, amount)
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/sell')
  async sell(
    @User('_id') userId: string,
    @Body() { playerId, amount }: TransactionDto
  ) {
    return await this.transactionsService.sellPlayer(userId, playerId, amount)
  }
}
