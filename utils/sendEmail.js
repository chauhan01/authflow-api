const nodemailer = require("nodemailer")
const mailjetConfig = require('./mailjetConfig')
const mailjetTransport = require('nodemailer-mailjet-transport')

const sendEmail = async({to, subject, html})=> {
  const transport = nodemailer.createTransport(mailjetTransport(mailjetConfig));
  const mail = {
    from: 'shubham chauhan <alene.champlin95@ethereal.email>',
    to,
    subject,
    html
  };
  try{
    const info = await transport.sendMail(mail);
    console.log(info);
  } catch (err) {
    console.error(err);
  }
}


module.exports = sendEmail
// let transporter = nodemailer.createTransport(nodemailerConfig)
//    return transporter.sendMail({
//     from: '"shubham chauhan" <alene.champlin95@ethereal.email>', // sender address
//     to, // list of receivers
//     subject, // Subject line
//     html, // html body
//   })

// const nodemailer = require("nodemailer")
// const mailjetConfig = require('./mailjetConfig')
// const mailjetTransport = require('nodemailer-mailjet-transport')

// const sendEmail = async({to, subject, html})=> {

//    let transporter = nodemailer.createTransport(mailjetTransport(mailjetConfig))
//    return transporter.sendMail({
//     from: '"shubham chauhan" <shubhamchauhan125@gmail.com>', // sender address
//     to, // list of receivers
//     subject, // Subject line
//     html, // html body
//   })
// }

// module.exports = sendEmail
