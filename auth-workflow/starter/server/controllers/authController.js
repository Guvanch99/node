const crypto = require('crypto')
const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail, sendResetPassword, hashString } = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex')

  const user = await User.create({ name, email, password, role, verificationToken });
  const origin = 'http://localhost:3000/'

  const protocol = req.protocol
  const host = req.get('host')
  const forwardedHost = req.get('x-forwarded-host')
  const forwardedProtocol = req.get('x-forwarded-proto')
  await sendVerificationEmail({
    name:user.name,
    email:user.email,
    verificationToken:user.verificationToken,
    origin
  })

  res.status(StatusCodes.CREATED).json(user)
};

const verifyEmail = async (req,res)=>{
  const { verificationToken, email } = req.body
  if(!verificationToken|| !email){
    throw new CustomError.BadRequestError('There is no verification token or email');
  }
  const user = await User.findOne({email})
  if(!user){
    throw new CustomError.UnauthenticatedError('There is no User with this email');
  }
  if(verificationToken !== user.verificationToken){
    throw new CustomError.BadRequestError('Tokens does not match');
  }

  user.isVerified = true
  user.verificationToken = ''
  user.verified = new Date()

 await user.save()
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const tokenUser = createTokenUser(user);
  //create refresh token
  let refreshToken = ''
  const existingToken = await Token.findOne({user:user._id})
  if(existingToken){
    const { isValid } = existingToken
    if(!isValid){
      throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: userToken })
    return
  }
  //check for existing token
  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = {
    refreshToken,
    ip,
    userAgent,
    user:user._id
  }
  await Token.create(userToken)
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: userToken });
};

const logout = async (req, res) => {

  await Token.findOneAndDelete({user: req.user.userId})

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const forgotPassword = async (req,res)=>{
  const { email } = req.body
  if(!email){
    throw new CustomError.UnauthenticatedError('There is no email');
  }

  const user = await User.findOne({email})

  if(!user){
    const passwordToken = crypto.randomBytes(70).toString('hex')
    const origin = 'http://localhost:3000/'
    await sendResetPassword({name:user.name, email:user.email, token:passwordToken, origin})
    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(new Date() + tenMinutes)
    user.passwordToken = hashString(passwordToken)
    user.passwordTokenExpirationDate = passwordTokenExpirationDate

    await user.save()
  }
}
const resetPassword = async (req,res)=>{
  const { token, email, password } = req.body
  if(!token || !email || !password){
    throw new CustomError.BadRequestError('Please provide all values')
  }

  const user = await User.findOne({ email })

  if(user){
    const currentDate = new Date()
    if(user.passwordToken === hashString(token) && user.passwordTokenExpirationDate>currentDate){
      user.password = password
      user.passwordToken = null
      user.passwordTokenExpirationDate = null
      await user.save()
    }
  }
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
};
