const {Schema, model} = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken");

const regexEmail=  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const UserModel = Schema({
  name:{
    type: String,
    required:[true, 'Please provide name'],
    minlength: 3,
    maxlength: 50
  },
  email:{
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    match: [
      regexEmail,
      'Please provide a valid email'
    ]
  },
  password:{
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6
  }
})

UserModel.pre('save', async function (next){
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
  next()
})

UserModel.methods.getName = function (){
  return this.name
}

UserModel.methods.createJWT = function(){
  return jwt.sign(
    { userId: this._id, name: this.name },
    'jwtSecret',
    { expiresIn: '1h' })
}

UserModel.methods.comparePassword = async function (candidatePassword){
  return await bcryptjs.compare(candidatePassword, this.password)
}

module.exports = model('User', UserModel)
