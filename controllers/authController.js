const User = require("../models/user")
const CustomError = require('../errors')
const crypto = require('crypto')
const { StatusCodes } = require("http-status-codes")
const Token = require('../models/token')


const {createHash,sendVerificationEmail, createTokenUser,attachCookiesToResponse, sendResetPasswordEmail} = require('../utils')


const register = async(req, res)=>{
    const {name, email, password} = req.body
    const emailAlreadyExist = await User.findOne({email})
    if(emailAlreadyExist){
        throw new CustomError.BadRequestError('email already registered')
    }

    const verificationToken = crypto.randomBytes(40).toString('hex')
    const user = await User.create({name, email, password, verificationToken})
    const origin=process.env.ORIGIN

    await sendVerificationEmail({
        name:user.name,
        email:user.email,
        verificationToken:user.verificationToken,
        origin

    })

    res.status(StatusCodes.OK).json({msg: 'Resistration successfull !, Please confirm your email.'})
}

const verifyEmail = async(req, res)=>{
    const {verificationToken, email} = req.body
    const user = await User.findOne({email})
    
    if(!user){
        throw new CustomError.UnauthenticatedError('verification failed')
    }
    if(user.verificationToken !== verificationToken){
        throw new CustomError.UnauthenticatedError('verification failed')
    }
    (user.isVerified=true),
    (user.verified=Date.now()),
    user.verificationToken=''
    await user.save()
    
    res.status(StatusCodes.OK).json({msg:'Email verified successfully'})

}


const login = async(req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        throw new CustomError.BadRequestError('please provide email and password')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    if(!user.isVerified){
        throw new CustomError.UnauthenticatedError('Please verifiy your email before login')
    }

    const tokenUser = createTokenUser(user)

    let refreshToken = ''
    const existingToken = await Token.findOne({user:user._id})
    if(existingToken){
        const {isValid} = existingToken
        if(!isValid){
            throw new CustomError.UnauthenticatedError('Invalid Credentials')
        }
        refreshToken = existingToken.refreshToken
        attachCookiesToResponse({res, user:tokenUser, refreshToken})
        res.status(StatusCodes.OK).json({user:tokenUser})
        return
    }
    refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = {refreshToken, ip, userAgent, user:user._id}

    await Token.create(userToken)

    attachCookiesToResponse({res, user:tokenUser, refreshToken})
    res.status(StatusCodes.OK).json({user:tokenUser})
}


const logout = async(req, res)=>{
    await Token.findOneAndDelete({user:req.user.UserId})

    res.cookie('accessToken', 'logout', {
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.cookie('refreshToken', 'logout', {
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg:'user logged out'})
}



const forgotPassword = async(req, res)=>{
    const {email} = req.body
    if(!email){
        throw new CustomError.BadRequestError('Please provide registered email')
    }
    const user = await User.findOne({email})
    
    if(user){
        const passwordToken = crypto.randomBytes(70).toString('hex')
        //send email with reset password link
        const origin = process.env.ORIGIN
        
        
        await sendResetPasswordEmail({name:user.name,email:user.email,passwordToken:passwordToken, origin} )
        const fifteenMinutes = 1000*60*15
        const passwordTokenExpDate = new Date(Date.now()+fifteenMinutes)
        user.passwordToken = createHash(passwordToken)
        user.passwordTokenExpirationDate = passwordTokenExpDate
        await user.save()
        res.status(StatusCodes.OK).json({msg:"Password reset link sent, Please check your email"})
    }
}
const resetPassword = async(req, res)=>{
    const {email, token, password} = req.body
    if(!email || !token || !password){
        throw new CustomError.BadRequestError('please provide all values')
    }
    const user = await User.findOne({email})
    
    if(user){
        const currentDate = new Date()
        if(user.passwordToken === createHash(token) &&
        user.passwordTokenExpirationDate>currentDate){
            user.password = password
            user.passwordToken=null
            user.passwordTokenExpirationDate=null
            await user.save()
        }
    }
    res.send('password updated successfully')
    
}


module.exports = {register, login, logout, verifyEmail, forgotPassword, resetPassword}