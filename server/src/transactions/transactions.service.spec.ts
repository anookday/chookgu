import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { BadRequestException } from '@nestjs/common'

import { PlayersModule } from '@players/players.module'
import {
  PlayerDocument,
  Player,
  PlayerSchema,
} from '@players/schemas/player.schema'
import { PortfoliosModule } from '@portfolios/portfolios.module'
import {
  PortfolioDocument,
  Portfolio,
  PortfolioSchema,
} from '@portfolios/schemas/portfolio.schema'
import { UsersModule } from '@users/users.module'
import { UserDocument, User, UserSchema } from '@users/schemas/user.schema'
import { TransactionsService } from '@transactions/transactions.service'
import {
  Transaction,
  TransactionSchema,
  TransactionDocument,
  TransactionType,
} from '@transactions/schemas/transaction.schema'
import { users, players, portfolios, ids } from '@test/data'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'

describe('TransactionsService', () => {
  let module: TestingModule
  let service: TransactionsService

  // models
  let playerModel: Model<PlayerDocument>
  let userModel: Model<UserDocument>
  let portfolioModel: Model<PortfolioDocument>
  let transactionModel: Model<TransactionDocument>

  // sample players
  const kane = players.find((player) => player.name === 'Harry Kane')
  const son = players.find((player) => player.name === 'Heung-min Son')
  const silva = players.find((player) => player.name === 'Bernardo Silva')

  beforeAll(async () => {
    // initialize module
    module = await Test.createTestingModule({
      imports: [
        PlayersModule,
        UsersModule,
        PortfoliosModule,
        rootMongooseTestModule({
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([
          { name: Transaction.name, schema: TransactionSchema },
          { name: Portfolio.name, schema: PortfolioSchema },
          { name: Player.name, schema: PlayerSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      providers: [TransactionsService],
    }).compile()

    // initialize service
    service = module.get<TransactionsService>(TransactionsService)

    // initialize models
    playerModel = module.get<Model<PlayerDocument>>('PlayerModel')
    userModel = module.get<Model<UserDocument>>('UserModel')
    portfolioModel = module.get<Model<PortfolioDocument>>('PortfolioModel')
    transactionModel =
      module.get<Model<TransactionDocument>>('TransactionModel')
  })

  beforeEach(async () => {
    // populate initial data
    await playerModel.deleteMany({})
    await playerModel.create(players)
    await userModel.deleteMany({})
    await userModel.create(users)
    await portfolioModel.deleteMany({})
    await portfolioModel.create(portfolios)
    await transactionModel.deleteMany({})
  })

  it('is defined', async () => {
    expect(service).toBeDefined()
  })

  it('buys valid amount of valid players', async () => {
    // buy 1 Heung-min Son for 85M
    let user = await service.buyPlayer(
      'standard',
      ids.mary.toString(),
      son._id,
      1
    )
    expect(user).toBeDefined()
    let portfolio = await portfolioModel.findOne({
      user: ids.mary,
      season: 'standard',
    })
    expect(portfolio).not.toBeNull()
    expect(portfolio.balance).toEqual(415000000)
    expect(portfolio.players.length).toEqual(1)
    expect(portfolio.players[0].player).toEqual(son._id)
    expect(portfolio.players[0].amount).toEqual(1)
    expect(portfolio.players[0].averageValue).toEqual(85000000)

    // buy 2 more Heung-min Son for 170M
    user = await service.buyPlayer('standard', ids.mary.toString(), son._id, 2)
    portfolio = await portfolioModel.findOne({
      user: ids.mary,
      season: 'standard',
    })
    expect(user).toBeDefined()
    expect(portfolio.balance).toEqual(245000000)
    expect(portfolio.players.length).toEqual(1)
    expect(portfolio.players[0].player).toEqual(son._id)
    expect(portfolio.players[0].amount).toEqual(3)
    expect(portfolio.players[0].averageValue).toEqual(85000000)

    // buy 3 Bernardo Silva for 210M
    user = await service.buyPlayer(
      'standard',
      ids.mary.toString(),
      silva._id,
      3
    )
    portfolio = await portfolioModel.findOne({
      user: ids.mary,
      season: 'standard',
    })
    expect(user).toBeDefined()
    expect(portfolio.balance).toEqual(35000000)
    expect(portfolio.players.length).toEqual(2)
    expect(portfolio.players[1].player).toEqual(silva._id)
    expect(portfolio.players[1].amount).toEqual(3)
    expect(portfolio.players[1].averageValue).toEqual(70000000)

    // check that transaction history is valid
    const transactions = await service.getUserTransactions(
      ids.mary.toString(),
      0
    )
    expect(transactions).toBeDefined()
    expect(transactions.length).toEqual(3)
    // first transaction
    expect(transactions[2].player).toEqual(son._id)
    expect(transactions[2].type).toEqual(TransactionType.Buy)
    expect(transactions[2].price).toEqual(son.currentValue)
    expect(transactions[2].amount).toEqual(1)
    // second transaction
    expect(transactions[1].player).toEqual(son._id)
    expect(transactions[1].type).toEqual(TransactionType.Buy)
    expect(transactions[1].price).toEqual(son.currentValue)
    expect(transactions[1].amount).toEqual(2)
    // third transaction
    expect(transactions[0].player).toEqual(silva._id)
    expect(transactions[0].type).toEqual(TransactionType.Buy)
    expect(transactions[0].price).toEqual(silva.currentValue)
    expect(transactions[0].amount).toEqual(3)
  })

  it('sells valid amount of valid players', async () => {
    // buy 4 Harry Kane for 480M
    let user = await service.buyPlayer(
      'standard',
      ids.mary.toString(),
      kane._id,
      4
    )
    let portfolio = await portfolioModel.findOne({
      user: ids.mary,
      season: 'standard',
    })
    expect(user).toBeDefined()
    expect(portfolio.balance).toEqual(20000000)
    expect(portfolio.players.length).toEqual(1)
    expect(portfolio.players[0].player).toEqual(kane._id)
    expect(portfolio.players[0].amount).toEqual(4)
    expect(portfolio.players[0].averageValue).toEqual(120000000)

    // sell 1 Harry Kane for 120M
    user = await service.sellPlayer(
      'standard',
      ids.mary.toString(),
      kane._id,
      1
    )
    portfolio = await portfolioModel.findOne({
      user: ids.mary,
      season: 'standard',
    })
    expect(user).toBeDefined()
    expect(portfolio.balance).toEqual(140000000)
    expect(portfolio.players.length).toEqual(1)
    expect(portfolio.players[0].player).toEqual(kane._id)
    expect(portfolio.players[0].amount).toEqual(3)
    expect(portfolio.players[0].averageValue).toEqual(120000000)

    // sell 2 Harry Kane for 240M
    user = await service.sellPlayer(
      'standard',
      ids.mary.toString(),
      kane._id,
      2
    )
    portfolio = await portfolioModel.findOne({
      user: ids.mary,
      season: 'standard',
    })
    expect(user).toBeDefined()
    expect(portfolio.balance).toEqual(380000000)
    expect(portfolio.players.length).toEqual(1)
    expect(portfolio.players[0].player).toEqual(kane._id)
    expect(portfolio.players[0].amount).toEqual(1)
    expect(portfolio.players[0].averageValue).toEqual(120000000)

    // sell last remaining Harry Kane for 120M
    user = await service.sellPlayer(
      'standard',
      ids.mary.toString(),
      kane._id,
      1
    )
    portfolio = await portfolioModel.findOne({
      user: ids.mary,
      season: 'standard',
    })
    expect(user).toBeDefined()
    expect(portfolio.balance).toEqual(500000000)
    expect(portfolio.players.length).toEqual(0)

    // check that transaction history is valid
    const transactions = await service.getUserTransactions(
      ids.mary.toString(),
      0
    )
    expect(transactions).toBeDefined()
    expect(transactions.length).toEqual(4)
    // first transaction
    expect(transactions[3].player).toEqual(kane._id)
    expect(transactions[3].type).toEqual(TransactionType.Buy)
    expect(transactions[3].price).toEqual(kane.currentValue)
    expect(transactions[3].amount).toEqual(4)
    // second transaction
    expect(transactions[2].player).toEqual(kane._id)
    expect(transactions[2].type).toEqual(TransactionType.Sell)
    expect(transactions[2].price).toEqual(kane.currentValue)
    expect(transactions[2].amount).toEqual(1)
    // third transaction
    expect(transactions[1].player).toEqual(kane._id)
    expect(transactions[1].type).toEqual(TransactionType.Sell)
    expect(transactions[1].price).toEqual(kane.currentValue)
    expect(transactions[1].amount).toEqual(2)
    // fourth transaction
    expect(transactions[0].player).toEqual(kane._id)
    expect(transactions[0].type).toEqual(TransactionType.Sell)
    expect(transactions[0].price).toEqual(kane.currentValue)
    expect(transactions[0].amount).toEqual(1)
  })

  it('fails to buy if amount of players is invalid', async () => {
    // cannot buy less than 1 players
    await expect(
      service.buyPlayer('standard', ids.mary.toString(), son._id, 0)
    ).rejects.toThrowError(BadRequestException)
    await expect(
      service.buyPlayer('standard', ids.mary.toString(), son._id, -123)
    ).rejects.toThrowError(BadRequestException)

    // cannot buy amount over user's available funds
    await expect(
      service.buyPlayer('standard', ids.mary.toString(), son._id, 10)
    ).rejects.toThrowError(BadRequestException)
  })

  it('fails to buy if player is invalid', async () => {
    await expect(
      service.buyPlayer('standard', ids.mary.toString(), 0, 1)
    ).rejects.toThrowError(BadRequestException)
  })

  it('fails to sell if amount of players is invalid', async () => {
    await service.buyPlayer('standard', ids.mary.toString(), kane._id, 4)
    // cannot sell less than 1 players
    await expect(
      service.sellPlayer('standard', ids.mary.toString(), kane._id, 0)
    ).rejects.toThrowError(BadRequestException)
    await expect(
      service.sellPlayer('standard', ids.mary.toString(), kane._id, -123)
    ).rejects.toThrowError(BadRequestException)

    // cannot sell amount over amount that user owns
    await expect(
      service.sellPlayer('standard', ids.mary.toString(), kane._id, 5)
    ).rejects.toThrowError(BadRequestException)
  })

  it('fails to sell if player is invalid', async () => {
    // cannot sell if player does not exist
    await expect(
      service.sellPlayer('standard', ids.mary.toString(), 0, 1)
    ).rejects.toThrowError(BadRequestException)

    // cannot sell if user does not own player
    await expect(
      service.sellPlayer('standard', ids.mary.toString(), silva._id, 1)
    ).rejects.toThrowError(BadRequestException)
  })

  afterAll(async () => {
    await closeInMongodConnection()
  })
})
