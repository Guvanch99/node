const mongoose = require('mongoose')

const ReviewModal = mongoose.Schema({
  rating:{
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide rating']
  },
  title:{
    type: String,
    trim:true,
    required: [true, 'Please provide a title'],
    maxlength:100
  },
  comment:{
    type: String,
    required: [true, 'Please provide a comment'],
  },
  product:{
    type: mongoose.Types.ObjectId,
    ref:'Product',
    required:true
  },
  user:{
    type: mongoose.Types.ObjectId,
    ref:'User',
    required:true
  }
},{timestamps:true})

ReviewModal.index(
  { product:1, user:1 },
  { unique:true }
)
module.exports = mongoose.model('Review', ReviewModal)
