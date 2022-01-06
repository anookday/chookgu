import { Model } from 'mongoose'
import { addDays } from 'date-fns'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Cron } from '@nestjs/schedule'
import {
  Player,
  PlayerDocument,
  AggregatedPlayer,
} from '@players/schemas/player.schema'
import { PlayerValue } from '@players/schemas/playerValue.schema'
import { QueryPlayerDto, SortBy } from '@players/dto/query-player.dto'
import { SortOrder } from '@util/constants'
import { generatePrice } from '@util/generate'
import { scrape } from '@util/scrape'

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>
  ) {}

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
    const sortOptions =
      sortBy === SortBy.Name
        ? { [sortBy]: sortOrder, _id: SortOrder.Asc }
        : {
            [sortBy]: sortOrder,
            [SortBy.Name]: SortOrder.Asc,
            _id: SortOrder.Asc,
          }
    return await this.playerModel
      .find(findOptions, scoreOptions)
      .collation({ locale: 'en', strength: 1 })
      .sort({ ...scoreOptions, ...sortOptions })
      .skip(index)
      .limit(20)
  }

  async getRecentValueMargins(amount: number, sortOrder: SortOrder) {
    return await this.playerModel
      .aggregate<AggregatedPlayer>([
        {
          $addFields: {
            margin: {
              $subtract: [
                { $arrayElemAt: ['$value.amount', -1] },
                { $arrayElemAt: ['$value.amount', -2] },
              ],
            },
          },
        },
        {
          $addFields: {
            marginRatio: {
              $divide: ['$margin', { $arrayElemAt: ['$value.amount', -2] }],
            },
          },
        },
      ])
      .sort({ margin: sortOrder })
      .limit(amount)
  }

  /**
   * Check the database every hour to check whether the players collection is
   * empty. If so, generate and save player data to the database.
   */
  @Cron('0 0 * * * *')
  async generatePlayers() {
    let documents = await this.playerModel.countDocuments()

    if (documents === 0) {
      const newPlayers = await scrape()
      const updatePlayerOptions = newPlayers.map(
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
  }

  /**
   * Add fake values after each player's current value in the database.
   * Run every day at 12am.
   */
  @Cron('0 0 0 * * *')
  async generatePlayerValues() {
    const players = await this.playerModel
      .find()
      .select('_id currentValue value')

    const updatePlayerOptions = players.map((player) => {
      const newValue: PlayerValue = {
        date: new Date(),
        amount: generatePrice(player.value[player.value.length - 1].amount),
      }

      return {
        updateOne: {
          filter: { _id: player._id },
          update: {
            $set: {
              currentValue: newValue.amount,
              value: [...player.value, newValue],
            },
          },
        },
      }
    })

    await this.playerModel.bulkWrite(updatePlayerOptions)
  }

  /**
   * NOT FOR USE IN PRODUCTION.
   * Generate player prices one day after each player's latest price.
   */
  async generatePlayerValuesDev() {
    const players = await this.playerModel
      .find()
      .select('_id currentValue value')

    const updatePlayerOptions = players.map((player) => {
      const newValue: PlayerValue = {
        date: addDays(player.value[player.value.length - 1].date, 1),
        amount: generatePrice(player.value[player.value.length - 1].amount),
      }

      return {
        updateOne: {
          filter: { _id: player._id },
          update: {
            $set: {
              currentValue: newValue.amount,
              value: [...player.value, newValue],
            },
          },
        },
      }
    })

    await this.playerModel.bulkWrite(updatePlayerOptions)
  }
}
