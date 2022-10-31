const {NotFoundError, BadRequestError, UnauthorizedError} = require("../errors");
const User = require('../models/User')
const UserDto = require('../dtos/UserDto')
const JWTService = require("./JWTService");

class UserService{

  async getAllUsers(){
    return User.find({role:'USER'}).select('-password');
  }
  async getSingleUser(id){
    const user = await User.findOne({role:"USER",id}).select('-password')
    if(!user){
      throw new NotFoundError('User not found')
    }
    return user
  }
  async updateUser({body: {name, email}, user:{userId}}){
    if(!name || !email){
      throw new BadRequestError('name or email  not provided')
    }
    const updatedUser = await User.findOneAndUpdate(
      {_id:userId},
      {name,email},
      {new:true, runValidators:true})
    const userDto = new UserDto(updatedUser)
    const token = JWTService.generateToken({...userDto})
    return {userDto, token}
  }
  async updatePassword({ user, oldPassword, newPassword}){
    if(!newPassword || !oldPassword){
      throw new BadRequestError('all params did not provided')
    }
    if(oldPassword === newPassword){
      throw new BadRequestError('old and new password are same')
    }
    const currentUser = await User.findOne({_id:user.userId})
    const isMatch = await currentUser.compare(oldPassword)

    if(!isMatch){
      throw new BadRequestError('old password is not correct')
    }
    currentUser.password = newPassword
    await currentUser.save()
  }

  checkPermissions(requestUser, resourceUserId){
    if (requestUser.role === 'ADMIN') return;
    if (requestUser.userId === resourceUserId.toString()) return;
    throw new UnauthorizedError(
      'Not authorized to access this route'
    );
  }
}

module.exports = new UserService()
