import { randomBytes } from 'crypto'
import { Model } from 'mongoose'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { Token, TokenDocument, TokenType } from '@token/schemas/token.schema'

export interface JwtToken {
  userId: string
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>
  ) {}

  /**
   * Create and return a token on the database associated with user and token type.
   */
  async createToken(userId: string, type: TokenType) {
    return await this.tokenModel.create({
      _id: randomBytes(64).toString('hex'),
      user: userId,
      type,
    })
  }

  /**
   * Return the token document with given id and type.
   */
  async getToken(tokenId: string, type: TokenType) {
    return await this.tokenModel.findOne({ _id: tokenId, type })
  }

  /**
   * Return the token document and associated user by token id and type.
   */
  async getTokenAndUser(tokenId: string, type: TokenType) {
    return await this.tokenModel
      .findOne({ _id: tokenId, type })
      .populate('user')
  }

  /**
   * Remove token with associted token id.
   */
  async deleteToken(tokenId: string) {
    return await this.tokenModel.deleteOne({ _id: tokenId })
  }

  /**
   * Get refresh token by user and token id.
   */
  async getRefreshToken(tokenId: string, userId: string) {
    console.log(tokenId, userId)
    const token = await this.getToken(tokenId, 'refresh')
    if (!token || token.user.toString() !== userId) {
      return null
    }
    return token
  }

  /**
   * Create and return a refresh token on the database that allows a user to
   * generate new access tokens.
   */
  async createRefreshToken(userId: string) {
    return await this.createToken(userId, 'refresh')
  }

  /**
   * Get confirmation token and associated user data by token id.
   */
  async getConfirmToken(tokenId: string) {
    return await this.getTokenAndUser(tokenId, 'confirm')
  }

  /**
   * Create and return a confirmation token on the database that allows a user
   * to verify their account.
   */
  async createConfirmToken(userId: string) {
    return await this.createToken(userId, 'confirm')
  }

  /**
   * Get confirmation token and associated user data by token id.
   */
  async getPassResetToken(tokenId: string) {
    return await this.getToken(tokenId, 'pw-reset')
  }

  /**
   * Create and return a confirmation token on the database that allows a user
   * to verify their account.
   */
  async createPassResetToken(userId: string) {
    return await this.createToken(userId, 'pw-reset')
  }

  /**
   * Get user id associated with given access token.
   */
  getAccessTokenUser(token: string) {
    let id: string

    try {
      const jwt = this.jwtService.verify<JwtToken>(token, {
        ignoreExpiration: true,
      })
      id = jwt.userId
    } catch (err) {
      console.log(err)
    }

    return id
  }

  /**
   * Create a JWT access token that gives a user authorized access to parts of
   * the app.
   */
  createAccessToken(userId: string) {
    const token: JwtToken = { userId }
    return this.jwtService.sign(token)
  }

  /**
   * Returns true if given jwt token is valid and not expired.
   */
  async verifyAccessToken(token: string) {
    let verified = false

    try {
      if (this.jwtService.verify(token)) {
        verified = true
      }
    } catch (err) {
      //console.log(err)
    }

    return verified
  }
}
