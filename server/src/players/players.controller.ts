import { Controller, Get } from '@nestjs/common'
import { PlayersService } from './players.service'
import { PlayerDocument } from './schemas/player.schema'

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  async getPlayers(): Promise<PlayerDocument[]> {
    return await this.playersService.findAll()
  }

  @Get('/scrape')
  async gatherPlayers() {
    await this.playersService.scrapePlayersAndSave()

    return 'Success'
  }
}
