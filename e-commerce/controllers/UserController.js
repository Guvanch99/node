const { StatusCodes } = require('http-status-codes')
const unauthorizedError= require('../errors/unauthorized')
const CookieService = require('../services/CookieService')
const UserService = require('../services/UserService')

class UserController{
  async getAllUsers(req,res){
    const users = await UserService.getAllUsers()

    res.status(StatusCodes.OK).json(users)
  }
  async getSingleUser(req,res){
    const user = await UserService.getSingleUser(req.params.id)
    UserService.checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json(user)
  }
  async showCurrentUser(req,res){
    res.status(StatusCodes.OK).json({user: req.user})
  }
  async updateUser(req,res){
   const {userDto, token} = await UserService.updateUser(req)
    CookieService.attachCookiesToResponse({res, token})
    res.status(StatusCodes.OK).json(userDto)
  }
  async updateUserPassword(req,res){
    const {user, body:{ newPassword, oldPassword }} = req
    await UserService.updatePassword({user,oldPassword, newPassword})
    res.status(StatusCodes.OK).json({msg:'Password are changed'})
  }
}

module.exports = new UserController()
