const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')




const ErrorHandlerMiddleware=(err, req, res, next)=>{
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrongs'
  }
  if(err instanceof CustomAPIError){
    res.status(err.statusCode).json({err:err.message})
  }

  if(err.code && err.code === 11000){
    customError.msg = `Duplicate`
    customError.statusCode = 400
  }
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = ErrorHandlerMiddleware
