import {
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
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

  // TODO: make this a cron job
  @Post('/scrape')
  async gatherPlayers() {
    await this.playersService.scrapePlayersAndSave()

    return 'Success'
  }

  // TODO: remove this when this is deployed on production
  @Post('/generate-before')
  async generateFakeDataBeforeCurrent() {
    await this.playersService.prependFakeData()

    return 'Success'
  }

  // TODO: remove this when this is deployed on production
  @Post('/generate-after')
  async generateFakeDataAfterCurrent() {
    await this.playersService.appendFakeData()

    return 'Success'
  }
}
