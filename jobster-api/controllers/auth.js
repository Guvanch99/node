const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')

class AuthController{

 async registration(req, res){
  const { name, email, password } = req.body
  if(!name || !email || !password){
   throw new BadRequestError('Please provide name, email and password')
  }
  const { createJWT, name: userName } = await User.create({...req.body})

  res.status(StatusCodes.CREATED).json({name: userName, token: createJWT()})
 }

 async login(req, res){
  const { email, password } = req.body

  if(!email || !password){
    throw new BadRequestError('Please provide name, email and password')
  }

  const user  = await User.findOne({ email })

  if(!user){
   throw new UnauthenticatedError('Invalid Credentials')
  }

  const isPasswordCorrect= await user.comparePassword(password)

  if(!isPasswordCorrect){
   throw new UnauthenticatedError('Invalid Credentials')
  }

   res
     .status(StatusCodes.OK)
     .json({
      name: user.name,
      token: user.createJWT()
     })
  }
}

module.exports = new AuthController()
