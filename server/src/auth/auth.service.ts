import { verify } from 'argon2'
import { randomBytes } from 'crypto'
import { Model } from 'mongoose'
import { Details } from 'express-useragent'
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Token, TokenDocument, TokenType } from '@auth/schemas/token.schema'
import { MailService } from '@mail/mail.service'
import { PortfoliosService } from '@portfolios/portfolios.service'
import { UserDocument, isUserDocument } from '@users/schemas/user.schema'
import { UsersService } from '@users/users.service'
import { CreateUserProfileDto } from '@users/dto/create-userProfile.dto'
import { USER_STARTING_BALANCE } from '@util/constants'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private portfoliosService: PortfoliosService,
    private mailService: MailService,
    private jwtService: JwtService,
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>
  ) {}

  /**
   * Compare hashed given password with the hashed password stored in database
   * with the corresponding email. If they match, return the retrieved user.
   * @param email User's email address
   * @param password unhashed password to compare to user's password on the server
   * @returns User object if valid, else null
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findForAuth(email)

    // invalid email
    if (!user) {
      throw new UnauthorizedException('Invalid email')
    }

    // invalid password
    const verifyResult = await verify(user.password, password)
    if (!verifyResult) {
      throw new UnauthorizedException('Invalid password')
    }
    return user
  }

  /**
   * Create a JWT indicating that gives a user authorized access to parts of
   * the app.
   */
  login(userId: string) {
    return this.jwtService.sign({ userId })
  }

  /**
   * Validate and create new user. If successful, send a confirmation email to
   * the user's given email address.
   */
  async register({ email, username, password }: CreateUserProfileDto) {
    // create new user in database
    const newUser = await this.usersService.create(email, username, password)

    // send confirmation email to newly created account
    if (newUser) {
      await this.sendVerificationEmail(newUser)
    }

    return newUser
  }

  /**
   * Return the token document with given id and type.
   */
  async getToken(id: string, type: TokenType) {
    return await this.tokenModel.findOne({ _id: id, type })
  }

  /**
   * Send an account confirmation email to the user's registered email.
   */
  async sendVerificationEmail(user: string | UserDocument) {
    // get user document
    let recipient: UserDocument
    if (typeof user === 'string') {
      recipient = await this.usersService.findById(user)
    } else {
      recipient = user
    }

    // generate verification token
    const token = randomBytes(64).toString('hex')
    await this.tokenModel.create({
      _id: token,
      user: recipient._id,
      type: 'confirm',
    })

    // send user email with verification token attached
    await this.mailService.sendConfirmation(recipient.email, token)
  }

  /**
   * Verify user with the confirmation token given to the user (sent by email).
   */
  async verify(token: string) {
    // find verification token on database
    let verification = await this.tokenModel.findById(token).populate('user')
    // token does not exist or has expired
    if (!verification || verification.type !== 'confirm') {
      throw new NotFoundException(
        'Confirmation token does not exist or has expired'
      )
    }
    // user associated with token does not exist
    if (!isUserDocument(verification.user)) {
      throw new NotFoundException('User not found')
    }

    // if user is already verified then there is no need to update database
    if (verification.user.verified) return
    // verify user
    verification.user.verified = true
    // indicate that user profile has been updated
    verification.user.modified = new Date()
    // update user document
    await verification.user.save()
    // delete verification token
    await verification.delete()

    // give user starting credits
    await this.portfoliosService.create(
      verification.user._id,
      'standard',
      USER_STARTING_BALANCE
    )
  }

  async sendResetPasswordEmail(email: string, ip: string, details: Details) {
    const user = await this.usersService.findByEmail(email)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const token = randomBytes(64).toString('hex')
    await this.tokenModel.create({
      _id: token,
      user: user._id,
      type: 'pw-reset',
    })

    await this.mailService.sendPasswordReset(email, ip, details, token)
  }

  async resetPassword(password: string, token: string) {
    const dbToken = await this.tokenModel.findById(token)

    if (!dbToken) {
      throw new NotFoundException('Token does not exist or has expired')
    }

    if (dbToken.type !== 'pw-reset') {
      throw new BadRequestException('Token is invalid')
    }

    const user = await this.usersService.findById(dbToken.user.toString())

    if (!user) {
      throw new NotFoundException('User associated with token does not exist')
    }

    await this.usersService.updateProfile(dbToken.user.toString(), { password })
    await dbToken.delete()
  }
}
