const { BadRequestError, UnauthenticatedError} = require("../errors")
const User = require("../models/User")
const JWTService = require('../services/JWTService')
const UserDto = require("../dtos/UserDto");

class AuthService{
  async validateRegister({email, name, password}){
    if(!name || !email || !password){
      throw  new BadRequestError('Provide please all credentials')
    }
    const candidate = await User.findOne({email})

    if(candidate){
      throw  new  BadRequestError('Email already in use')
    }
  }
  async register({name, email, password}){
    await this.validateRegister({email, name, password})

    const isFirstAccount = await User.countDocuments({}) === 0
    const role = isFirstAccount? 'ADMIN':'USER'
    const user = await User.create({
      name,
      email,
      role,
      password
    })
    const userDto = new UserDto(user)
    const token = JWTService.generateToken({...userDto})
    return {userDto, token}
  }
  async validateLogin({email, name, password}){
    if(!name || !email || !password){
      throw  new BadRequestError('Provide please all credentials')
    }
    const user = await User.findOne({email})

    if(!user){
      throw  new  UnauthenticatedError('No user found')
    }
    const isMatch = await user.compare(password)
    if(!isMatch){
      throw  new  UnauthenticatedError('password or email invalid')
    }
    return user
  }
  async login({email, name, password}){
    const user =  await this.validateLogin({email, name, password})
    const userDto = new UserDto(user)
    const token = JWTService.generateToken({...userDto})

    return {
      token,
      userDto
    }
  }

}


module.exports = new AuthService()
