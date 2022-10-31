const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const validator = require('validator')

const UserModel = mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Please provide name'],
  },
  email:{
    type: String,
    required: [true, 'Please email name'],
    unique: true,
    validate:{
      validator:validator.isEmail,
      message:'Please provide valid email'
    }
  },
  password:{
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6
  },
  role: {
    type:String,
    enum: ['ADMIN', "USER"],
    default:'USER'
  }
})

UserModel.pre('save', async function(){
  const salt = await bcryptjs.genSalt(7);
  this.password = await bcryptjs.hash(this.password, salt);
})

UserModel.methods.compare = async function(candidatePassword){
 return await bcryptjs.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserModel)
