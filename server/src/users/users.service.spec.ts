import { verify } from 'argon2'
import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { NotFoundException, BadRequestException } from '@nestjs/common'

import { UsersService } from '@users/users.service'
import { User, UserSchema, UserDocument } from '@users/schemas/user.schema'
import { users } from '@test/data'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'

describe('UsersService', () => {
  let module: TestingModule
  let service: UsersService
  let ids: any = {}

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
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersService],
    }).compile()

    // initialize service
    service = module.get<UsersService>(UsersService)
  })

  beforeEach(async () => {
    // populate users with initial data
    const myModel = module.get<Model<UserDocument>>('UserModel')
    await myModel.deleteMany({})
    const initialUsers = await myModel.create(users)

    for (let user of initialUsers) {
      ids[user.username.split(' ')[0].toLowerCase()] = user.id

      // verify Mary and make her an admin
      if (user.username === 'Mary Sue') {
        user.verified = true
        user.auth = 'admin'
        await user.save()
      }
    }
  })

  it('is defined', async () => {
    expect(service).toBeDefined()
  })

  it('finds existing users by id', async () => {
    await expect(service.findById(ids.john)).resolves.toBeDefined()
    await expect(service.findById(ids.mary)).resolves.toBeDefined()
    await expect(service.findById(ids.sheesh)).resolves.toBeDefined()
    await expect(service.findById('doesnotexist')).rejects.toThrowError(
      NotFoundException
    )
  })

  it('finds existing users by email', async () => {
    await expect(
      service.findByEmail('johndoe@gmail.com')
    ).resolves.toBeDefined()
    await expect(
      service.findByEmail('marysue@outlook.com')
    ).resolves.toBeDefined()
    await expect(
      service.findByEmail('sheesh@sheesh.com')
    ).resolves.toBeDefined()
    await expect(service.findByEmail('doesnot@exist.com')).resolves.toBeNull()
  })

  it('finds user with password', async () => {
    const user = await service.findByEmail('johndoe@gmail.com')
    const userWithPassword = await service.findForAuth('johndoe@gmail.com')
    expect(user.password).toBeUndefined()
    expect(userWithPassword.password).toBeDefined()
  })

  it('creates new user', async () => {
    const newUser = await service.create(
      'newuser@email.com',
      'Bruce Wayne',
      'ImNotBatman'
    )

    expect(newUser).toBeDefined()
    expect(newUser.username).toEqual('Bruce Wayne')
    await expect(service.findById(newUser.id)).resolves.toBeDefined()
  })

  it('prevents creating new user if email is duplicate of verified email', async () => {
    await expect(
      service.create('marysue@outlook.com', 'Not Mary', 'asdfasdfasdf')
    ).rejects.toThrowError(BadRequestException)
  })

  it('updates existing user', async () => {
    const mary = await service.updateProfile(ids.mary, {
      username: 'Mary Jane',
      password: 'peterparker',
    })
    expect(mary).toBeDefined()
    expect(mary.username).toEqual('Mary Jane')
    const passwordMatches = await verify(mary.password, 'peterparker')
    expect(passwordMatches).toEqual(true)
  })

  it('deletes existing user', async () => {
    await expect(service.findById(ids.sheesh)).resolves.toBeDefined()
    await expect(service.deleteUser(ids.sheesh)).resolves.toBeDefined()
    await expect(service.findById(ids.sheesh)).rejects.toThrowError(
      NotFoundException
    )
  })

  afterAll(async () => {
    await closeInMongodConnection()
  })
})
