import { verify, hash } from 'argon2'
import { randomBytes } from 'crypto'
import { Model } from 'mongoose'
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import {
  Verification,
  VerificationDocument,
} from '@auth/schemas/verification.schema'
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
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>
  ) {}

  /**
   * Compare hashed given password with the hashed password stored in database
   * with the corresponding email. If they match, return the retrieved user.
   * @param email User's email address
   * @param password unhashed password to compare to user's password on the server
   * @returns User object if valid, else null
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneForAuth(email)

    // invalid email
    if (!user) {
      throw new UnauthorizedException('Invalid email/password')
    }

    // invalid password
    const verifyResult = await verify(user.password, password)
    if (!verifyResult) {
      throw new UnauthorizedException('Invalid email/password')
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
   * Validate new user info. If valid, create new user in database.
   */
  async register({ username, email, password }: CreateUserProfileDto) {
    // user is already registered AKA duplicate email is found
    const existingUser = await this.usersService.findByEmail(email)
    if (existingUser && existingUser.verified) {
      throw new BadRequestException('That email is taken. Try another one.')
    }

    // username must be between 1 and 30 characters
    if (username.length === 0 || username.length > 30) {
      throw new BadRequestException(
        'Username must be between 1 to 30 characters long.'
      )
    }

    // email must not be empty
    if (email.length === 0) {
      throw new BadRequestException('Invalid email.')
    }

    // password must have at least 10 characters
    if (password.length < 10) {
      throw new BadRequestException(
        'Password must be at least 10 chracters long.'
      )
    }

    // hash password with salt
    const hashedPw = await hash(password)

    // create new user in database
    const newUser = await this.usersService.create({
      username,
      email,
      password: hashedPw,
    })

    // send confirmation email to newly created account
    await this.sendVerificationEmail(newUser)

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
    await this.verificationModel.create({
      _id: token,
      user: recipient._id,
    })

    // send user email with verification token attached
    await this.mailService.sendConfirmation(recipient.email, token)
  }

  /**
   * Verify user with the confirmation token given to the user (sent by email).
   */
  async verify(token: string) {
    // find verification token on database
    let verification = await this.verificationModel
      .findById(token)
      .populate('user')
    // token does not exist or has expired
    if (!verification) {
      throw new NotFoundException(
        'Confirmation token does not exist or has expired'
      )
    }
    // user associated with token does not exist
    if (!isUserDocument(verification.user)) {
      throw new NotFoundException('User not found')
    }
    // user is already verified
    if (verification.user.verified) {
      throw new BadRequestException('User is already verified')
    }
    // verify user
    verification.user.verified = true
    // give user starting credits
    verification.user.portfolio.find(
      ({ mode }) => mode === 'standard'
    ).balance = USER_STARTING_BALANCE
    // update user document
    await verification.user.save()
    // delete verification token
    await verification.delete()
  }
}
