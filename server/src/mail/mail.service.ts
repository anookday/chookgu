import { resolve } from 'path'
import { readFileSync } from 'fs'
import { Injectable } from '@nestjs/common'
import { MailService as SGMailService } from '@sendgrid/mail'

@Injectable()
export class MailService {
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

    const redirect = `${process.env.CLIENT_URL}/verify?token=${token}`
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
}
