import { Response } from 'express'
import {
  Controller,
  Get,
  Res,
  Query,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common'
import { PlayersService } from '@players/players.service'
import { PlayerDocument } from '@players/schemas/player.schema'
import { QueryPlayerDto } from '@players/dto/query-player.dto'
import { SortOrder } from '@util/constants'

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPlayers(@Query() query: QueryPlayerDto): Promise<PlayerDocument[]> {
    return await this.playersService.find(query)
  }

  @Get('/top-margins')
  async getTopMargins() {
    return await this.playersService.getRecentValueMargins(3, SortOrder.Desc)
  }

  @Get('/bottom-margins')
  async getBottomMargins() {
    return await this.playersService.getRecentValueMargins(3, SortOrder.Asc)
  }

  @Get('/generate-price')
  async generatePrice(@Res() res: Response) {
    if (process.env.NODE_ENV != 'production') {
      await this.playersService.generatePlayerValuesDev()
      res.status(200).send('player prices randomly generated')
    } else {
      throw new NotFoundException()
    }
  }
}
