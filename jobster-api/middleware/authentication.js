const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { UnauthenticatedError } = require('../errors')

const authenticationMiddleware = async (req,res,next)=>{
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, 'jwtSecret')
    req.user=payload
    next()
  }catch (error) {
  console.log('error', error)
    throw new UnauthenticatedError('Authentication invalid');
  }
}

module.exports = authenticationMiddleware
