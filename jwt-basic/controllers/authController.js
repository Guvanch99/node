const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const Role = require('../model/Role')
const User = require('../model/User')

class AuthController{
  async registration(req,res){
    const {username, password} = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({msg:'Must be provided credentials'})
    }
    const candidate = await User.findOne({username})

    if(candidate){
      return res.status(400).json({msg:'User already exists'})
    }
    const hashPassword = bcrypt.hashSync(password, 7)

    const userRole = await Role.findOne({value:'USER'})
    const user = await User.create({username, password:hashPassword, roles:[userRole.value]})
    console.log('process.env.JWT_SECRET', process.env.JWT_SECRET)
    const token = jwt.sign({id: user._id,role:user.roles}, 'jwtSecret', {expiresIn: '24h'})
    res.json({success:true, user, token})
  }
  async login(req,res){
    const { username, password } = req.body
    const user = await User.findOne({username})
    if(!user){
      return res.status(400).json({ msg: 'User not found' })
    }

    const validatePassword=bcrypt.compareSync(password, user.password)
    if(!validatePassword){
      return res.status(400).json({ msg: 'Password in correct' })
    }
    const token = jwt.sign({id: user._id,role:user.roles}, process.env.JWT_SECRET, {expiresIn: '24h'})
    res.status(200).json(token)
  }
  async getUsers(req,res){
    const userRole = new Role()
    const adminRole = new Role({value:'ADMIN'})
    await userRole.save()
    await adminRole.save()
  }

}

module.exports = new AuthController()
