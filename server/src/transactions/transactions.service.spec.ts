import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { BadRequestException } from '@nestjs/common'

import { TransactionsService } from '@transactions/transactions.service'
import {
  Transaction,
  TransactionSchema,
  TransactionType,
} from '@transactions/schemas/transaction.schema'
import { users, players } from '@test/data'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'
import { PlayersModule } from '@players/players.module'
import { PlayerDocument } from '@players/schemas/player.schema'
import { UsersModule } from '@users/users.module'
import { UserDocument } from '@users/schemas/user.schema'

describe('TransactionsService', () => {
  let module: TestingModule
  let service: TransactionsService

  // sample user
  let john: UserDocument

  // sample players
  const kane = players.find((player) => player.name === 'Harry Kane')
  const son = players.find((player) => player.name === 'Heung-min Son')
  const silva = players.find((player) => player.name === 'Bernardo Silva')

  beforeAll(async () => {
    // initialize module
    module = await Test.createTestingModule({
      imports: [
        UsersModule,
        PlayersModule,
        rootMongooseTestModule({
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([
          { name: Transaction.name, schema: TransactionSchema },
        ]),
      ],
      providers: [TransactionsService],
    }).compile()

    // initialize service
    service = module.get<TransactionsService>(TransactionsService)
  })

  beforeEach(async () => {
    // populate initial data
    const playerModel = module.get<Model<PlayerDocument>>('PlayerModel')
    await playerModel.deleteMany({})
    await playerModel.create(players)
    const userModel = module.get<Model<UserDocument>>('UserModel')
    await userModel.deleteMany({})
    const createdUsers = await userModel.create(users)

    // initialize user
    john = createdUsers[0]
    john.portfolio.balance = 500000000
    await john.save()
  })

  it('is defined', async () => {
    expect(service).toBeDefined()
    expect(john).toBeDefined()
    expect(john.username).toEqual('John Doe')
  })

  it('buys valid amount of valid players', async () => {
    // buy 1 Heung-min Son for 85M
    let user = await service.buyPlayer(john.id, son._id, 1)
    expect(user).toBeDefined()
    expect(user.portfolio.balance).toEqual(415000000)
    expect(user.portfolio.players.length).toEqual(1)
    expect(user.portfolio.players[0].player).toEqual(son._id)
    expect(user.portfolio.players[0].amount).toEqual(1)
    expect(user.portfolio.players[0].averageValue).toEqual(85000000)

    // buy 2 more Heung-min Son for 170M
    user = await service.buyPlayer(john.id, son._id, 2)
    expect(user).toBeDefined()
    expect(user.portfolio.balance).toEqual(245000000)
    expect(user.portfolio.players.length).toEqual(1)
    expect(user.portfolio.players[0].player).toEqual(son._id)
    expect(user.portfolio.players[0].amount).toEqual(3)
    expect(user.portfolio.players[0].averageValue).toEqual(85000000)

    // buy 3 Bernardo Silva for 210M
    user = await service.buyPlayer(john.id, silva._id, 3)
    expect(user).toBeDefined()
    expect(user.portfolio.balance).toEqual(35000000)
    expect(user.portfolio.players.length).toEqual(2)
    expect(user.portfolio.players[1].player).toEqual(silva._id)
    expect(user.portfolio.players[1].amount).toEqual(3)
    expect(user.portfolio.players[1].averageValue).toEqual(70000000)

    // check that transaction history is valid
    const transactions = await service.getUserTransactions(john.id, 0)
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
    let user = await service.buyPlayer(john.id, kane._id, 4)
    expect(user).toBeDefined()
    expect(user.portfolio.balance).toEqual(20000000)
    expect(user.portfolio.players.length).toEqual(1)
    expect(user.portfolio.players[0].player).toEqual(kane._id)
    expect(user.portfolio.players[0].amount).toEqual(4)
    expect(user.portfolio.players[0].averageValue).toEqual(120000000)

    // sell 1 Harry Kane for 120M
    user = await service.sellPlayer(john.id, kane._id, 1)
    expect(user).toBeDefined()
    expect(user.portfolio.balance).toEqual(140000000)
    expect(user.portfolio.players.length).toEqual(1)
    expect(user.portfolio.players[0].player).toEqual(kane._id)
    expect(user.portfolio.players[0].amount).toEqual(3)
    expect(user.portfolio.players[0].averageValue).toEqual(120000000)

    // sell 2 Harry Kane for 240M
    user = await service.sellPlayer(john.id, kane._id, 2)
    expect(user).toBeDefined()
    expect(user.portfolio.balance).toEqual(380000000)
    expect(user.portfolio.players.length).toEqual(1)
    expect(user.portfolio.players[0].player).toEqual(kane._id)
    expect(user.portfolio.players[0].amount).toEqual(1)
    expect(user.portfolio.players[0].averageValue).toEqual(120000000)

    // sell last remaining Harry Kane for 120M
    user = await service.sellPlayer(john.id, kane._id, 1)
    expect(user).toBeDefined()
    expect(user.portfolio.balance).toEqual(500000000)
    expect(user.portfolio.players.length).toEqual(0)

    // check that transaction history is valid
    const transactions = await service.getUserTransactions(john.id, 0)
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
    await expect(service.buyPlayer(john.id, son._id, 0)).rejects.toThrowError(
      BadRequestException
    )
    await expect(
      service.buyPlayer(john.id, son._id, -123)
    ).rejects.toThrowError(BadRequestException)

    // cannot buy amount over user's available funds
    await expect(service.buyPlayer(john.id, son._id, 10)).rejects.toThrowError(
      BadRequestException
    )
  })

  it('fails to buy if player is invalid', async () => {
    await expect(service.buyPlayer(john.id, 0, 1)).rejects.toThrowError(
      BadRequestException
    )
  })

  it('fails to sell if amount of players is invalid', async () => {
    await service.buyPlayer(john.id, kane._id, 4)
    // cannot sell less than 1 players
    await expect(service.sellPlayer(john.id, kane._id, 0)).rejects.toThrowError(
      BadRequestException
    )
    await expect(
      service.sellPlayer(john.id, kane._id, -123)
    ).rejects.toThrowError(BadRequestException)

    // cannot sell amount over amount that user owns
    await expect(service.sellPlayer(john.id, kane._id, 5)).rejects.toThrowError(
      BadRequestException
    )
  })

  it('fails to sell if player is invalid', async () => {
    // cannot sell if player does not exist
    await expect(service.sellPlayer(john.id, 0, 1)).rejects.toThrowError(
      BadRequestException
    )

    // cannot sell if user does not own player
    await expect(
      service.sellPlayer(john.id, silva._id, 1)
    ).rejects.toThrowError(BadRequestException)
  })

  afterAll(async () => {
    await closeInMongodConnection()
  })
})
