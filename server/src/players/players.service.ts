import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Player, PlayerDocument } from './schemas/player.schema'
import { scrape } from '../util/scrape'

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>
  ) {}

  async findAll(): Promise<PlayerDocument[]> {
    return await this.playerModel.find().exec()
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
}
