const APIError = require('../exceptions/error-handler')
const tokenService = require('../service/token-service')
const authMiddleware = (req, res, next)=>{
  try {
    const authorizationHeader = req.headers.authorization
    if(!authorizationHeader){
      return next(APIError.UnauthorizedError())
    }
    const accessToken = req.headers.authorization.split(' ')
    if(!accessToken){
      return next(APIError.UnauthorizedError())
    }
    const userData = tokenService.validateAccessToken(accessToken)
    if(!userData){
      return next(APIError.UnauthorizedError())
    }
    req.user = userData
    next()
  }catch (e){
    return next(APIError.UnauthorizedError())
  }
}

module.exports = authMiddleware
