import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import {
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from '@auth/auth.service'
import { Token, TokenSchema, TokenDocument } from '@auth/schemas/token.schema'
import { MailService } from '@mail/mail.service'
import { PortfoliosModule } from '@portfolios/portfolios.module'
import { UsersModule } from '@users/users.module'
import { User, UserSchema, UserDocument } from '@users/schemas/user.schema'
import { CreateUserProfileDto } from '@users/dto/create-userProfile.dto'
import { users, passwords } from '@test/data'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'

describe('AuthService', () => {
  let module: TestingModule
  let service: AuthService
  // models for direct access to database documents
  let userModel: Model<UserDocument>
  let tokenModel: Model<TokenDocument>
  // hash maps to make testing easier
  let ids: any = {}
  let emails: any = {}
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
        PortfoliosModule,
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

    // initialize models
    userModel = module.get<Model<UserDocument>>('UserModel')
    tokenModel = module.get<Model<TokenDocument>>('TokenModel')

    // initialize test variables
    for (let user of users) {
      emails[user.username.split(' ')[0].toLowerCase()] = user.email
    }
  })

  beforeEach(async () => {
    // reset db
    await userModel.deleteMany({})
    await tokenModel.deleteMany({})

    // populate db with sample data
    const initialUsers = await userModel.create(users)

    // save document ids to hash map
    for (let user of initialUsers) {
      ids[user.username.split(' ')[0].toLowerCase()] = user.id
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
      service.validateUser(emails.john, passwords.john)
    ).resolves.toBeDefined()
    await expect(
      service.validateUser(emails.mary, passwords.mary)
    ).resolves.toBeDefined()
    await expect(
      service.validateUser(emails.sheesh, passwords.sheesh)
    ).resolves.toBeDefined()
  })

  it('does not validate invalid credentials', async () => {
    // invalid email
    await expect(
      service.validateUser('doesnot@exist.com', 'whatever')
    ).rejects.toThrowError(UnauthorizedException)

    // invalid password
    await expect(
      service.validateUser(emails.john, passwords.mary)
    ).rejects.toThrowError(UnauthorizedException)
  })

  it('registers and verifies users with valid fields', async () => {
    // register
    let user = await service.register(validRegisterFields)
    expect(user).not.toBeNull()
    expect(user.verified).toEqual(false)

    await expect(
      service.validateUser(
        validRegisterFields.email,
        validRegisterFields.password
      )
    ).resolves.not.toBeNull()

    // verify
    const token = await tokenModel.findOne({ user: user.id, type: 'confirm' })
    expect(token).not.toBeNull()

    await service.verify(token.id)
    user = await userModel.findById(user.id)
    expect(user.verified).toEqual(true)
    await expect(
      tokenModel.findOne({ user: user.id, type: 'confirm' })
    ).resolves.toBeNull()
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

  it('does not verify user with invalid token', async () => {
    await expect(service.verify('someInvalidToken')).rejects.toThrowError(
      NotFoundException
    )
  })

  it('requests password reset and changes password to new valid value', async () => {
    const newPassword = 'newpassword'
    await service.sendResetPasswordEmail(emails.john, '', null)

    const token = await tokenModel.findOne({ user: ids.john, type: 'pw-reset' })
    expect(token).not.toBeNull()

    await service.resetPassword(newPassword, token.id)
    await expect(
      service.validateUser(emails.john, newPassword)
    ).resolves.not.toBeNull()
    await expect(
      tokenModel.findOne({ user: ids.john, type: 'pw-reset' })
    ).resolves.toBeNull()
  })

  it('rejects password reset request if user is invalid', async () => {
    await expect(
      service.sendResetPasswordEmail('invalid@email.com', '', null)
    ).rejects.toThrowError(NotFoundException)
  })

  afterAll(async () => {
    await closeInMongodConnection()
  })
})
