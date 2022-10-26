const ApiError = require('../exceptions/error-handler')
const errorHandlerMiddleware = (err,req,res,next) => {
  if(err instanceof ApiError){
    return res.status(err.status).json({msg: err.message})
  }

  return res.status(500).json({message: 'Server Error' })
}

module.exports = errorHandlerMiddleware
