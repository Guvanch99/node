const nodemailer = require('nodemailer')
class MailService {

  constructor() {
    console.log({
      service: "Gmail",
      secure: false,
      auth: {
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASSWORD
      }
    })

    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      secure: false,
      auth: {
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASSWORD
      }
    })
  }

  async sendActivationMail(to, link){
    await this.transporter.sendMail({
      from:process.env.SMTP_USER,
      to,
      subject: `Activation account, ${process.env.API_URL}`,
      text:"",
      html:
      `
<div>
      <h1>Hello</h1>
      <a href="${link}">${link}</a>
</div>

      `
    })
  }
}

module.exports = new MailService()
