import { Controller, Get, Body, UsePipes, ValidationPipe } from '@nestjs/common'
import { PlayersService } from './players.service'
import { PlayerDocument } from './schemas/player.schema'
import { QueryPlayerDto } from './dto/query-player.dto'

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPlayers(@Body() query: QueryPlayerDto): Promise<PlayerDocument[]> {
    return await this.playersService.find(query)
  }

  @Get('/scrape')
  async gatherPlayers() {
    await this.playersService.scrapePlayersAndSave()

    return 'Success'
  }
}
