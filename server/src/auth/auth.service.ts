import {
  Injectable,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { UsersService } from '../users/users.service'
import { User } from '../users/schemas/user.schema'
import { CreateUserProfileDto } from 'src/users/dto/create-userProfile.dto'
import { USER_STARTING_BALANCE } from '../util/constants'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  /**
   * Compare hashed given password with the hashed password stored in database
   * with the corresponding email. If they match, return the retrieved user.
   * @param email User's email address
   * @param password unhashed password to compare to user's password on the server
   * @returns User object if valid, else null
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneForAuth(email)

    if (user) {
      const verifyResult = await argon2.verify(user.password, password)
      if (verifyResult) return user
    }

    return null
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
  async register(createUserProfileDto: CreateUserProfileDto) {
    const { username, email, password } = createUserProfileDto

    // user is already registered AKA duplicate email is found
    const existingUser = await this.usersService.findByEmail(email)
    if (existingUser != null) {
      throw new ConflictException('That email is taken. Try another one.')
    }

    // username must be between 1 and 30 characters
    if (username.length === 0 || username.length > 30) {
      throw new UnprocessableEntityException(
        'Username must be between 1 to 30 characters long.'
      )
    }

    // email must not be empty
    // TODO: ACTUALLY validate emails by sending confirmation links
    if (email.length === 0) {
      throw new UnprocessableEntityException('Invalid email.')
    }

    // password must have at least 10 characters
    if (password.length < 10) {
      throw new UnprocessableEntityException(
        'Password must be at least 10 chracters long.'
      )
    }

    // hash password with salt
    const hash = await argon2.hash(password)

    // create new user in database
    return await this.usersService.create({
      username,
      email,
      password: hash,
    })
  }
}
