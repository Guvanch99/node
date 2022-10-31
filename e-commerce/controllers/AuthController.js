const StatusCodes = require('http-status-codes')
const AuthService  = require('../services/AuthService')
const CookieService = require("../services/CookieService");

class AuthController {
  async register(req,res){
    const {userDto, token} = await AuthService.register(req.body)
    CookieService.attachCookiesToResponse({res, token})
    res.status(StatusCodes.CREATED).json(userDto)
  }

  async login(req,res){
    const { token, userDto } = await AuthService.login(req.body)
    CookieService.attachCookiesToResponse({res, token})
    res.status(StatusCodes.CREATED).json(userDto)
  }
  async logout(req,res){
   CookieService.removeCookies({res})
    res.status(StatusCodes.OK).json({msg:'success'})
  }
}

module.exports = new AuthController()
