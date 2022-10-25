const jwt = require("jsonwebtoken");
const roleMiddleware=(roles)=>{
  return (req,res,next) => {
    const authHeader = req.headers.authorization
    console.log('authHeader', authHeader)
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

    const {role:userRoles}= jwt.verify(token, 'jwtSecret')
    let hasRole = false
    console.log('userRoles',userRoles)
    userRoles.map(role=>{
      if(roles.includes(role)){
        hasRole = true
      }
    })
    if(!hasRole){
      res.status(403).json({msg:'Not authorized'})
    }
    next()
  }
}

module.exports = roleMiddleware
