import { resolve } from 'path'
import { readFileSync } from 'fs'
import { Details } from 'express-useragent'
import { lookup } from 'geoip-lite'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { MailService as SGMailService } from '@sendgrid/mail'
import countries from '@util/countries'

@Injectable()
export class MailService {
  /**
   * Send account confirmation email.
   */
  async sendConfirmation(to: string, token: string) {
    if (process.env.NODE_ENV === 'test') return

    let mailer = new SGMailService()
    mailer.setApiKey(process.env.SENDGRID_KEY)
    const from = process.env.EMAIL
    const subject = 'Chookgu: Activate your account'
    let html = readFileSync(
      resolve(__dirname, './confirmation-min.html'),
      'utf-8'
    )

    const redirect = `${process.env.APP_URL}/verify?token=${token}`
    html = html.replace(/#CONFIRM_LINK/, redirect)

    try {
      await mailer.send({ to, from, subject, html })
    } catch (error) {
      console.error(error)
      if (error.response) {
        console.error(error.response.body)
      }
    }
  }

  /**
   * Send password reset mail.
   */
  async sendPasswordReset(
    to: string,
    ip: string,
    details: Details,
    token: string
  ) {
    if (process.env.NODE_ENV === 'test') return

    // email configuration
    let mailer = new SGMailService()
    mailer.setApiKey(process.env.SENDGRID_KEY)
    const from = process.env.EMAIL
    const subject = 'Chookgu: Reset Your Password'
    let html = readFileSync(resolve(__dirname, './pw-reset-min.html'), 'utf-8')

    // get the request's country of origin via IP address
    let country = ''
    const countryCode = lookup(ip)?.country
    if (countryCode) {
      country = countries[countryCode]
    }

    // generate redirect urls
    const redirect = `${process.env.APP_URL}/account/pw-reset?token=${token}`

    // replace placeholder values with generated ones in the email HTML
    html = html.replace(/#IP/, ip)
    html = html.replace(/#LOCATION/, country)
    html = html.replace(/#SOURCE/, details.source)
    html = html.replace(/#RESET_PW/, redirect)

    // send mail
    try {
      await mailer.send({ to, from, subject, html })
    } catch (error) {
      console.error(error)
      if (error.response) {
        console.error(error.response.body)
      }
      throw new InternalServerErrorException('Failed to send email')
    }
  }
}
