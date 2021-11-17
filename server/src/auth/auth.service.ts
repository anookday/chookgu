import { verify } from 'argon2'
import { Details } from 'express-useragent'
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { MailService } from '@mail/mail.service'
import { PortfoliosService } from '@portfolios/portfolios.service'
import { TokenService } from '@token/token.service'
import { UserDocument, isUserDocument } from '@users/schemas/user.schema'
import { UsersService } from '@users/users.service'
import { USER_STARTING_BALANCE } from '@util/constants'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private portfoliosService: PortfoliosService,
    private mailService: MailService,
    private tokenService: TokenService
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
    const token = await this.tokenService.createConfirmToken(recipient._id)

    // send user email with verification token attached
    await this.mailService.sendConfirmation(recipient.email, token._id)
  }

  /**
   * Verify user with the confirmation token given to the user (sent by email).
   */
  async verify(token: string) {
    // find verification token on database
    let verification = await this.tokenService.getConfirmToken(token)
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

    const token = await this.tokenService.createPassResetToken(user._id)

    await this.mailService.sendPasswordReset(email, ip, details, token._id)
  }

  async resetPassword(password: string, token: string) {
    const resetToken = await this.tokenService.getPassResetToken(token)

    if (!resetToken) {
      throw new NotFoundException('Token does not exist or has expired')
    }

    if (!isUserDocument(resetToken.user)) {
      await this.usersService.updateProfile(resetToken.user, {
        password,
      })
      await this.tokenService.deleteToken(resetToken._id)
    }
  }
}
