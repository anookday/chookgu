import {
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { PlayersService } from './players.service'
import { PlayerDocument } from './schemas/player.schema'
import { QueryPlayerDto } from './dto/query-player.dto'

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPlayers(@Query() query: QueryPlayerDto): Promise<PlayerDocument[]> {
    return await this.playersService.find(query)
  }

  // TODO: make this a cron job
  @Post('/scrape')
  async gatherPlayers() {
    await this.playersService.scrapePlayersAndSave()

    return 'Success'
  }

  // TODO: remove this when this is deployed on production
  @Post('/generate')
  async generateFakeData() {
    await this.playersService.generateFakeData()

    return 'Success'
  }
}
