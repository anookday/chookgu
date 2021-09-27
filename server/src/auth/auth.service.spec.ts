import { Model } from 'mongoose'
import { hash } from 'argon2'

import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from '@auth/auth.service'
import { Token, TokenSchema } from '@auth/schemas/token.schema'
import { MailService } from '@mail/mail.service'
import { UsersModule } from '@users/users.module'
import { User, UserSchema, UserDocument } from '@users/schemas/user.schema'
import { CreateUserProfileDto } from '@users/dto/create-userProfile.dto'
import { users } from '@test/data'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'

describe('AuthService', () => {
  let module: TestingModule
  let service: AuthService
  // hash maps to make testing easier
  let ids: any = {}
  let emails: any = {}
  let pws: any = {}
  // uninitialized list of users with hashed passwords
  let hashedUsers: CreateUserProfileDto[] = []
  // variable used to test creating a valid profile
  const validRegisterFields: CreateUserProfileDto = {
    email: 'hello@gmail.com',
    username: 'hello world',
    password: 'atleast10charslong!',
  }

  beforeAll(async () => {
    // initialize module
    module = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          secret: 'JwtTestKey',
          signOptions: { expiresIn: '5s' },
        }),
        rootMongooseTestModule({
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
      ],
      providers: [AuthService, MailService],
    }).compile()

    // initialize service
    service = module.get<AuthService>(AuthService)

    // initialize test variables
    for (let user of users) {
      pws[user.username.split(' ')[0].toLowerCase()] = user.password
      emails[user.username.split(' ')[0].toLowerCase()] = user.email
      const password = await hash(user.password)
      hashedUsers.push({
        ...user,
        password,
      })
    }
  })

  beforeEach(async () => {
    // populate users with initial data
    const myModel = module.get<Model<UserDocument>>('UserModel')
    await myModel.deleteMany({})
    const initialUsers = await myModel.create(hashedUsers)

    for (let user of initialUsers) {
      // save document ids to hash map
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

  it('can login', async () => {
    expect(service.login(ids.john)).toBeDefined()
  })

  it('validates existing users', async () => {
    await expect(
      service.validateUser(emails.john, pws.john)
    ).resolves.toBeDefined()
    await expect(
      service.validateUser(emails.mary, pws.mary)
    ).resolves.toBeDefined()
    await expect(
      service.validateUser(emails.sheesh, pws.sheesh)
    ).resolves.toBeDefined()
  })

  it('does not validate invalid credentials', async () => {
    // invalid email
    await expect(
      service.validateUser('doesnot@exist.com', 'whatever')
    ).rejects.toThrowError(UnauthorizedException)

    // invalid password
    await expect(
      service.validateUser(emails.john, pws.mary)
    ).rejects.toThrowError(UnauthorizedException)
  })

  it('registers users with valid fields', async () => {
    await expect(service.register(validRegisterFields)).resolves.toBeDefined()

    await expect(
      service.validateUser(
        validRegisterFields.email,
        validRegisterFields.password
      )
    ).resolves.toBeDefined()
  })

  it('does not register user with invalid email', async () => {
    // email is empty string
    await expect(
      service.register({ ...validRegisterFields, email: '' })
    ).rejects.toThrowError(BadRequestException)

    // email is duplicate
    await expect(
      service.register({ ...validRegisterFields, email: emails.mary })
    ).rejects.toThrowError(BadRequestException)
  })

  it('does not register user with invalid username', async () => {
    await expect(
      service.register({ ...validRegisterFields, username: '' })
    ).rejects.toThrowError(BadRequestException)
    await expect(
      service.register({
        ...validRegisterFields,
        username: 'morethan30characterssssssssssss',
      })
    ).rejects.toThrowError(BadRequestException)
  })

  it('does not register user with invalid password', async () => {
    await expect(
      service.register({ ...validRegisterFields, password: 'tooshort' })
    ).rejects.toThrowError(BadRequestException)
  })

  afterAll(async () => {
    await closeInMongodConnection()
  })
})
