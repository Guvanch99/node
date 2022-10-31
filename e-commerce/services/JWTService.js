const jwt = require('jsonwebtoken')
const {BadRequestError} = require("../errors");

class JWTService{
  generateToken(payload){
    try {
      return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    }catch (e) {
      throw new BadRequestError(`Something went wrong in jwtService ${e}`)
    }
  }
  isTokenValid(token){
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}

module.exports = new JWTService()
