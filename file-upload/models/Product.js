const mongoose = require('mongoose')

const ProductModel = mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Product name required']
  },
  price:{
    type: Number,
    required: [true, 'Product Price required']
  },
  image:{
    type: String,
    required: [true, 'Product Image required']
  }
})

module.exports = mongoose.model('Product', ProductModel)
