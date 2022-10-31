const CustomError = require('../errors');
const JWTService = require('../services/JWTService')

const authenticateUser = async (req,res,next)=>{
  const token = req.signedCookies.token

  if(!token){
    throw new CustomError.UnauthenticatedError('Authentication Invalid')
  }
  try{
    req.user = JWTService.isTokenValid(token)
    next()
  }catch (e) {
    throw new CustomError.UnauthenticatedError(`Something went wrong in parse jwt, ${e}`)
  }
}

const authorizePermissions = (permissions)=>{

  return (req, res, next) => {
    if(!permissions.includes(req.user.role)){
      throw new CustomError.UnauthorizedError('Dont have permission')
    }
    next()
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions
}
