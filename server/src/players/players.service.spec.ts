import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'

import { PlayersService } from '@players/players.service'
import { SortBy } from '@players/dto/query-player.dto'
import { SortOrder } from '@util/constants'
import {
  Player,
  PlayerSchema,
  PlayerDocument,
} from '@players/schemas/player.schema'
import { players } from '@test/data'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'

describe('PlayerService', () => {
  let module: TestingModule
  let service: PlayersService

  beforeAll(async () => {
    // initialize module
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule({
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([
          { name: Player.name, schema: PlayerSchema },
        ]),
      ],
      providers: [PlayersService],
    }).compile()

    // initialize service
    service = module.get<PlayersService>(PlayersService)
  })

  beforeEach(async () => {
    // populate users with initial data
    const myModel = module.get<Model<PlayerDocument>>('PlayerModel')
    await myModel.deleteMany({})
    await myModel.create(players)
  })

  it('is defined', async () => {
    expect(service).toBeDefined()
  })

  it('finds one by player id', async () => {
    // find Harry Kane
    const player = await service.findById(132098)
    expect(player).toBeDefined()
    expect(player.name).toEqual('Harry Kane')

    // find non-existing player
    await expect(service.findById(0)).resolves.toBeNull()
  })

  it('finds players by name A-Z', async () => {
    const players = await service.find({
      index: 0,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Asc,
      search: '',
    })

    expect(players.length).toEqual(20)
    expect(players[0].name).toEqual('Bernardo Silva')
    expect(players[19].name).toEqual('Trent Alexander-Arnold')
  })

  it('finds players by name Z-A', async () => {
    const players = await service.find({
      index: 0,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Desc,
      search: '',
    })

    expect(players.length).toEqual(20)
    expect(players[0].name).toEqual('Trent Alexander-Arnold')
    expect(players[19].name).toEqual('Bernardo Silva')
  })

  it('finds players by highest value', async () => {
    const players = await service.find({
      index: 0,
      sortBy: SortBy.Value,
      sortOrder: SortOrder.Desc,
      search: '',
    })

    expect(players.length).toEqual(20)
    expect(players[0].name).toEqual('Harry Kane')
    expect(players[19].name).toEqual('Timo Werner')
  })

  it('finds players by lowest value', async () => {
    const players = await service.find({
      index: 0,
      sortBy: SortBy.Value,
      sortOrder: SortOrder.Asc,
      search: '',
    })

    expect(players.length).toEqual(20)
    expect(players[0].name).toEqual('Timo Werner')
    expect(players[19].name).toEqual('Harry Kane')
  })

  it('finds no players after last existing index', async () => {
    const afterTwenty = await service.find({
      index: 20,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Asc,
      search: '',
    })

    expect(afterTwenty.length).toEqual(0)
  })

  it('finds players with one search term', async () => {
    // name search
    const harry = await service.find({
      index: 0,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Asc,
      search: 'harry',
    })

    expect(harry.length).toEqual(1)
    expect(harry[0].name).toEqual('Harry Kane')

    // team search
    const chelsea = await service.find({
      index: 0,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Asc,
      search: 'chelsea',
    })
    expect(chelsea.length).toEqual(4)

    // position search
    const forward = await service.find({
      index: 0,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Asc,
      search: 'forward',
    })
    expect(forward.length).toEqual(3)
  })

  it('finds players with multiple search terms', async () => {
    // name and team
    const sonTottenham = await service.find({
      index: 0,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Asc,
      search: 'son tottenham',
    })
    expect(sonTottenham.length).toEqual(2)
    expect(sonTottenham[0].name).toEqual('Heung-min Son')

    // name, team and position
    const lukakuChelseaForward = await service.find({
      index: 0,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Asc,
      search: 'lukaku chelsea forward',
    })
    expect(lukakuChelseaForward.length).toEqual(5)
    expect(lukakuChelseaForward[0].name).toEqual('Romelu Lukaku')
    expect(lukakuChelseaForward[1].name).toEqual('Timo Werner')
  })

  it('finds empty array with invalid search term', async () => {
    const messi = await service.find({
      index: 0,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Asc,
      search: 'messi',
    })
    expect(messi.length).toEqual(0)
  })

  afterAll(async () => {
    await closeInMongodConnection()
  })
})
