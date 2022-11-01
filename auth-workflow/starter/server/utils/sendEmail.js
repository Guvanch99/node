const nodemailer = require("nodemailer");

const sendEmail = async ({to, subject, html})=>{

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user:'madilyn47@ethereal.email',
      pass:'KHQCVURJFuCSnUsneE'
    }
  })

  return await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject,
    html
  });

}

const sendVerificationEmail = async ({name, email, verificationToken, origin})=>{
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
  const message ='<p>Please confirm your email by clicking following link</p>'


  return sendEmail({
    to:email,
    subject:'Email Confirmation',
    html:`
<h4>hello , ${name}</h4>
<a href="${verifyEmail}">Verify Email</a>
${message}
`
  })
}

const sendResetPassword= async ({name, email, token, origin})=>{
  const resetUrl = `${origin}/user/reset-password?token=${token}&email=${email}`

  const message = `<p>Please reset password by clicking on the following link : <a href="${resetUrl}">Reset Password</a> </p>`
  sendEmail({
    to:email,
    subject:'Reset Password',
    html:`<h4>Hello, ${name}</h4> ${message}`
  })
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPassword
}
