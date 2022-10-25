const jwt = require('jsonwebtoken')
const authentication=(req,res,next)=>{
  const authHeader = req.headers.authorization
  if(req.method ==='OPTIONS'){
    next()
  }
  if(!authHeader){
    res.status(400).json({msg:'Error'})
  }

  const token = authHeader.split(' ')[1]
  if(!token){
    res.status(400).json({msg:'Error'})
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  req.user = decodedToken
  next()
}

module.exports = authentication
