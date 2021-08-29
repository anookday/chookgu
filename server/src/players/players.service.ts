import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { addWeeks, subWeeks } from 'date-fns'
import { Player, PlayerDocument } from '@players/schemas/player.schema'
import { PlayerValue } from '@players/schemas/playerValue.schema'
import { QueryPlayerDto } from '@players/dto/query-player.dto'
import { scrape } from '@util/scrape'
import { generatePrice } from '@util/generate'

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>
  ) {}

  async findAll(): Promise<PlayerDocument[]> {
    return await this.playerModel.find().exec()
  }

  async findById(playerId: number) {
    return await this.playerModel.findById(playerId)
  }

  async find({
    index,
    sortBy,
    sortOrder,
    search,
  }: QueryPlayerDto): Promise<PlayerDocument[]> {
    const findOptions =
      search.length === 0 ? {} : { $text: { $search: search } }
    const scoreOptions =
      search.length === 0 ? {} : { score: { $meta: 'textScore' } }
    const result = await this.playerModel
      .find(findOptions, scoreOptions)
      .collation({ locale: 'en', strength: 1 })
      .sort({ ...scoreOptions, [sortBy]: sortOrder })
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
        currentValue,
        value,
      }) => ({
        updateOne: {
          filter: { _id },
          update: {
            $set: {
              name,
              position,
              nationality,
              dateOfBirth,
              team,
              image,
              currentValue,
            },
            $push: { value: { $each: value } },
          },
          upsert: true,
        },
      })
    )

    await this.playerModel.bulkWrite(updatePlayerOptions)
  }

  /**
   * Add fake values before each player's current value in the database.
   */
  async prependFakeData() {
    const players = await this.playerModel.find().select('_id value')

    const updatePlayerOptions = players.map((player) => {
      const fakeValue: PlayerValue = {
        date: subWeeks(player.value[0].date, 1),
        amount: generatePrice(player.value[0].amount),
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

  /**
   * Add fake values after each player's current value in the database.
   */
  async appendFakeData() {
    const players = await this.playerModel
      .find()
      .select('_id currentValue value')

    const updatePlayerOptions = players.map((player) => {
      const fakeValue: PlayerValue = {
        date: addWeeks(player.value[0].date, 1),
        amount: generatePrice(player.value[0].amount),
      }

      return {
        updateOne: {
          filter: { _id: player._id },
          update: {
            $set: {
              currentValue: fakeValue.amount,
              value: [...player.value, fakeValue],
            },
          },
        },
      }
    })

    await this.playerModel.bulkWrite(updatePlayerOptions)
  }
}
