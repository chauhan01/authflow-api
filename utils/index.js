const createTokenUser = require('./createTokenUser')
const {createJWT, isTokenValid, attachCookiesToResponse} = require('./jwt')
const nodemailerConfig = require('./mailjetConfig')
const sendEmail = require('./sendEmail')
const sendVerificationEmail = require('./sendVerificationEmail')
const createHash = require('./createhash')
const sendResetPasswordEmail = require('./sendResetPasswordMail')

module.exports = {sendResetPasswordEmail, createHash,createJWT, isTokenValid, attachCookiesToResponse, createTokenUser, nodemailerConfig, sendEmail,sendVerificationEmail}