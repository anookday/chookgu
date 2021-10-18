import { verify } from 'argon2'
import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { NotFoundException, BadRequestException } from '@nestjs/common'

import { UsersService } from '@users/users.service'
import { User, UserSchema, UserDocument } from '@users/schemas/user.schema'
import { users, ids, emails, validFields } from '@test/data'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'

describe('UsersService', () => {
  let module: TestingModule
  let service: UsersService
  // models
  let userModel: Model<UserDocument>

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

    // initialize models
    userModel = module.get<Model<UserDocument>>('UserModel')
  })

  beforeEach(async () => {
    // populate users with initial data
    await userModel.deleteMany({})
    await userModel.create(users)
  })

  it('is defined', async () => {
    expect(service).toBeDefined()
  })

  it('finds existing users by id', async () => {
    await expect(service.findById(ids.john.toString())).resolves.toBeDefined()
    await expect(service.findById(ids.mary.toString())).resolves.toBeDefined()
    await expect(service.findById('doesnotexist')).rejects.toThrowError(
      NotFoundException
    )
  })

  it('finds existing users by email', async () => {
    await expect(service.findByEmail(emails.john)).resolves.not.toBeNull()
    await expect(service.findByEmail(emails.mary)).resolves.not.toBeNull()
    await expect(service.findByEmail('doesnot@exist.com')).resolves.toBeNull()
  })

  it('finds user with password', async () => {
    const user = await service.findByEmail('johndoe@gmail.com')
    const userWithPassword = await service.findForAuth('johndoe@gmail.com')
    expect(user.password).toBeUndefined()
    expect(userWithPassword.password).toBeDefined()
  })

  it('creates new user', async () => {
    await expect(
      service.create(
        validFields.email,
        validFields.username,
        validFields.password
      )
    ).resolves.not.toBeNull()

    await expect(service.findByEmail(validFields.email)).resolves.not.toBeNull()
  })

  it('does not create user with invalid email', async () => {
    // email is empty string
    await expect(
      service.create('', validFields.username, validFields.password)
    ).rejects.toThrowError(BadRequestException)

    // email is duplicate
    await expect(
      service.create(emails.john, validFields.username, validFields.password)
    ).rejects.toThrowError(BadRequestException)
  })

  it('does not create user with invalid username', async () => {
    // too short
    await expect(
      service.create(validFields.email, '', validFields.password)
    ).rejects.toThrowError(BadRequestException)

    // too long
    await expect(
      service.create(
        validFields.email,
        'morethan30characterssssssssssss',
        validFields.password
      )
    ).rejects.toThrowError(BadRequestException)
  })

  it('does not create user with invalid password', async () => {
    await expect(
      service.create(validFields.email, validFields.username, 'tooshort')
    ).rejects.toThrowError(BadRequestException)
  })

  it('updates existing user', async () => {
    const mary = await service.updateProfile(ids.mary.toString(), {
      username: 'Mary Jane',
      password: 'peterparker',
    })
    expect(mary).toBeDefined()
    expect(mary.username).toEqual('Mary Jane')
    const passwordMatches = await verify(mary.password, 'peterparker')
    expect(passwordMatches).toEqual(true)
  })

  it('deletes existing user', async () => {
    await expect(
      service.deleteUser(ids.john.toString())
    ).resolves.not.toBeNull()
    await expect(service.findById(ids.john.toString())).rejects.toThrowError(
      NotFoundException
    )
  })

  afterAll(async () => {
    await closeInMongodConnection()
  })
})
