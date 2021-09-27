import { verify } from 'argon2'
import { randomBytes } from 'crypto'
import { Model } from 'mongoose'
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Token, TokenDocument } from '@auth/schemas/token.schema'
import { MailService } from '@mail/mail.service'
import { UserDocument, isUserDocument } from '@users/schemas/user.schema'
import { UsersService } from '@users/users.service'
import { CreateUserProfileDto } from '@users/dto/create-userProfile.dto'
import { USER_STARTING_BALANCE } from '@util/constants'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
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
    // give user starting credits
    verification.user.portfolio.find(
      ({ mode }) => mode === 'standard'
    ).balance = USER_STARTING_BALANCE
    // indicate that user profile has been updated
    verification.user.modified = new Date()
    // update user document
    await verification.user.save()
    // delete verification token
    await verification.delete()
  }
}
