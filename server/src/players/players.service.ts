import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { subWeeks } from 'date-fns'
import { Player, PlayerDocument } from './schemas/player.schema'
import { PlayerValue } from './schemas/playerValue.schema'
import { scrape } from '../util/scrape'
import { QueryPlayerDto } from './dto/query-player.dto'
import { generatePrice } from '../util/generate'

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>
  ) {}

  async findAll(): Promise<PlayerDocument[]> {
    return await this.playerModel.find().exec()
  }

  async find({
    index,
    sortBy,
    sortOrder,
    search,
  }: QueryPlayerDto): Promise<PlayerDocument[]> {
    let searchOptions = search ? { $text: { $search: search } } : {}
    const result = await this.playerModel
      .find(searchOptions)
      .collation({ locale: 'en', strength: 1 })
      .sort({ [sortBy]: sortOrder })
      .skip(index)
      .limit(10)

    return result
  }

  /**
   * Gather player data from transfermarkt and save it to database.
   */
  async scrapePlayersAndSave() {
    const players = await scrape()

    const updatePlayerOptions = players.map(
      ({
        _id,
        name,
        position,
        nationality,
        dateOfBirth,
        team,
        image,
        value,
      }) => ({
        updateOne: {
          filter: { _id },
          update: {
            $set: { name, position, nationality, dateOfBirth, team, image },
            $push: { value: { $each: value } },
          },
          upsert: true,
        },
      })
    )

    await this.playerModel.bulkWrite(updatePlayerOptions)
  }

  /**
   * Add fake values to each player in the database.
   */
  async generateFakeData() {
    const players = await this.playerModel.find().select('_id value')

    const updatePlayerOptions = players.map((player) => {
      const fakeValue: PlayerValue = {
        date: subWeeks(player.value[0].date, 1),
        amount: generatePrice(player.value[0].amount),
        currency: 'EUR',
      }

      return {
        updateOne: {
          filter: { _id: player._id },
          update: {
            $set: {
              value: [fakeValue, ...player.value],
            },
          },
        },
      }
    })

    await this.playerModel.bulkWrite(updatePlayerOptions)
  }
}
