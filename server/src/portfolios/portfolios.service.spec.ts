import { Model } from 'mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import {
  PlayerDocument,
  Player,
  PlayerSchema,
} from '@players/schemas/player.schema'
import { PortfolioDocument } from '@portfolios/schemas/portfolio.schema'
import { PortfoliosService } from '@portfolios/portfolios.service'
import {
  Portfolio,
  PortfolioSchema,
} from '@portfolios/schemas/portfolio.schema'
import { ids, users, portfolios, players } from '@test/data'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'
import { UserDocument, User, UserSchema } from '@users/schemas/user.schema'

describe('PortfoliosService', () => {
  let service: PortfoliosService

  // models
  let playerModel: Model<PlayerDocument>
  let userModel: Model<UserDocument>
  let portfolioModel: Model<PortfolioDocument>

  beforeAll(async () => {
    // initialize module
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule({
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([
          { name: Portfolio.name, schema: PortfolioSchema },
          { name: Player.name, schema: PlayerSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      providers: [PortfoliosService],
    }).compile()

    // initialize service
    service = module.get<PortfoliosService>(PortfoliosService)

    // initialize models
    playerModel = module.get<Model<PlayerDocument>>('PlayerModel')
    userModel = module.get<Model<UserDocument>>('UserModel')
    portfolioModel = module.get<Model<PortfolioDocument>>('PortfolioModel')
  })

  beforeEach(async () => {
    // populate initial data
    await playerModel.deleteMany({})
    await playerModel.create(players)
    await userModel.deleteMany({})
    await userModel.create(users)
    await portfolioModel.deleteMany({})
    await portfolioModel.create(portfolios)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('gets user portfolio', async () => {
    const portfolio = await service.get(ids.john.toString(), 'standard')
    expect(portfolio).toBeDefined()
    expect(portfolio.season).toEqual('standard')
    expect(portfolio.balance).toEqual(500000000)
    expect(portfolio.players.length).toEqual(2)

    let rashford = portfolio.players[0]
    expect(rashford.amount).toEqual(2)
    expect(rashford.averageValue).toEqual(85000000)
  })

  it('gets portfolio value history', async () => {
    const values = await service.getPortfolioValue(
      ids.john.toString(),
      'standard'
    )

    expect(values).not.toBeNull()
    expect(values.length).toEqual(5)
    expect(values.map((v) => v.value)).toEqual([
      65000000 * 2 + 70000000 * 3 + 500000000,
      70000000 * 2 + 80000000 * 3 + 500000000,
      75000000 * 2 + 95000000 * 3 + 500000000,
      80000000 * 2 + 65000000 * 3 + 500000000,
      85000000 * 2 + 85000000 * 3 + 500000000,
    ])
  })

  afterAll(async () => {
    await closeInMongodConnection()
  })
})
