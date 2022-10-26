const User =  require('../models/user-model')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/error-handler')

class UserService {
  async registration(email, password){
    const candidate = await User.findOne({email})
    if(candidate){
      ApiError.BadRequest('Bad Request')
    }
    const activationLink = uuidv4()
    const hashPassword = bcrypt.hashSync(password, 7)

    const user = await User.create({ email, password:hashPassword, activationLink })

    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/v1/activate/${activationLink}`)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return{
      ...tokens,
      user:userDto
    }
  }

  async activate(activationLink){
    const user = await User.findOne({activationLink})
    if(!user){
      ApiError.BadRequest('Bad Request')
    }
    user.isActivated = true

    await user.save()
  }

  async login(email, password){
    const user = await User.findOne({email})
    if(!user){
      throw ApiError.BadRequest('Not found')
    }
    const isPassEquals = await bcrypt.compare(password, user.password)

    if(!isPassEquals){
      throw ApiError.BadRequest('Password incorrect')
    }

    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return{
      ...tokens,
      user:userDto
    }
  }

 async logout(refreshToken){
   return await tokenService.removeToken(refreshToken)
 }

 async refresh(refreshToken){
  if(!refreshToken){
    throw ApiError.UnauthorizedError()
  }
  const userData = tokenService.validateRefreshToken(refreshToken)
   const tokenFromDB= tokenService.validateAccessToken(refreshToken)
   if(!userData|| !tokenFromDB){
     throw ApiError.UnauthorizedError()
   }
   const user = await User.findById(userData.id)
   const userDto = new UserDto(user)
   const tokens = tokenService.generateToken({...userDto})
   await tokenService.saveToken(userDto.id, tokens.refreshToken)
 }

 async getAllUsers(){
    const users = await User.find({})
   return users
 }
}

module.exports = new UserService()
