import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'

import { PlayersModule } from '@players/players.module'
import { UsersModule } from '@users/users.module'
import { TransactionsService } from '@transactions/transactions.service'
import {
  Transaction,
  TransactionSchema,
  TransactionDocument,
} from '@transactions/schemas/transaction.schema'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'

describe('TransactionsService', () => {
  let module: TestingModule
  let service: TransactionsService

  // models
  let transactionModel: Model<TransactionDocument>

  beforeAll(async () => {
    // initialize module
    module = await Test.createTestingModule({
      imports: [
        PlayersModule,
        UsersModule,
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

    transactionModel =
      module.get<Model<TransactionDocument>>('TransactionModel')
  })

  beforeEach(async () => {
    await transactionModel.deleteMany({})
  })

  it('is defined', async () => {
    expect(service).toBeDefined()
  })

  afterAll(async () => {
    await closeInMongodConnection()
  })
})
