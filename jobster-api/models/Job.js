const mongoose = require('mongoose')

const JobModel = new mongoose.Schema({
  company:{
    type: String,
    required: [true, 'Please provide company name'],
    maxLength: 50
  },
  position:{
    type: String,
    required: [true, 'Please provide position'],
    maxLength: 200,
  },
  status:{
    type: String,
    enum: ['interview', 'declined', 'pending'],
    default: 'pending'
  },
  createdBy:{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  }
},{
  timestamps:true
})

module.exports = mongoose.model('Job', JobModel)
