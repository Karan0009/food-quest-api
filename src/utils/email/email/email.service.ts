import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  transporter: nodemailer.Transporter;
  mailFrom = `Message From Food Quest ${this.getDefaultSenderEmail()}`;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport(this.getDefaultConfig());
  }

  async send(mailOptions: Mail.Options): Promise<unknown> {
    mailOptions.from = this.mailFrom;
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(info);
      });
    });
  }

  private getDefaultConfig(): SMTPTransport.Options {
    return {
      host: this.config.get('NODEMAILER_EMAIL_HOST'),
      port: 465,
      secure: true,
      auth: {
        user: this.config.get('NODEMAILER_EMAIL'),
        pass: this.config.get('NODEMAILER_EMAIL_PASSWORD'),
      },
      // auth: {
      //   user: this.config.get('NODEMAILER_EMAIL'),
      //   pass: this.config.get('NODEMAILER_EMAIL_PASSWORD'),
      // },
    };
  }

  private getDefaultSenderEmail(): string {
    return this.config.get('NODEMAILER_EMAIL') || '';
  }
}
