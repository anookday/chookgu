import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { UnauthorizedException, NotFoundException } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from '@auth/auth.service'
import { Token, TokenSchema, TokenDocument } from '@auth/schemas/token.schema'
import { MailService } from '@mail/mail.service'
import { PortfoliosModule } from '@portfolios/portfolios.module'
import { UsersModule } from '@users/users.module'
import { UsersService } from '@users/users.service'
import { User, UserSchema, UserDocument } from '@users/schemas/user.schema'
import { users, ids, emails, passwords, validFields } from '@test/data'
import { closeInMongodConnection, rootMongooseTestModule } from '@test/database'

describe('AuthService', () => {
  let module: TestingModule
  let service: AuthService
  let usersService: UsersService
  // models for direct access to database documents
  let userModel: Model<UserDocument>
  let tokenModel: Model<TokenDocument>

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
    usersService = module.get<UsersService>(UsersService)

    // initialize models
    userModel = module.get<Model<UserDocument>>('UserModel')
    tokenModel = module.get<Model<TokenDocument>>('TokenModel')
  })

  beforeEach(async () => {
    await userModel.deleteMany({})
    await userModel.create(users)
    await tokenModel.deleteMany({})
  })

  it('is defined', async () => {
    expect(service).toBeDefined()
  })

  it('can login', async () => {
    expect(service.login(ids.john.toString())).toBeDefined()
  })

  it('validates existing users', async () => {
    await expect(
      service.validateUser(emails.john, passwords.john)
    ).resolves.toBeDefined()
    await expect(
      service.validateUser(emails.mary, passwords.mary)
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
    // send verification mail
    await service.sendVerificationEmail(ids.mary.toString())
    const token = await tokenModel.findOne({ user: ids.mary, type: 'confirm' })
    expect(token).not.toBeNull()

    // verify user
    await service.verify(token.id)
    const user = await userModel.findById(ids.mary)
    expect(user.verified).toEqual(true)
    await expect(
      tokenModel.findOne({ user: ids.mary, type: 'confirm' })
    ).resolves.toBeNull()
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
