import { Controller, Post, UseGuards, Body } from '@nestjs/common'
import { TransactionsService } from '@transactions/transactions.service'
import { PurchaseDto } from '@transactions/dto/purchase.dto'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { User } from '@users/user.decorator'

@Controller('transaction')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/buy')
  async buy(@User('_id') userId: string, @Body() { playerId }: PurchaseDto) {
    return await this.transactionsService.buyPlayer(userId, playerId)
  }
}
