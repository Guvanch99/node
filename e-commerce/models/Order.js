const mongoose = require('mongoose')
const {model} = require("mongoose");

const SingleOrderItemSchema = mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  Image: {
    type:String,
    required:true
  },
  price: {
    type:String,
    required:true
  },
  amount: {
    type:String,
    required:true
  },
  product:{
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  }
})

const OrderSchema = mongoose.Schema({
  tax:{
    type: Number,
    required: true
  },
  shippingFee:{
    type: Number,
    required: true
  },
  subTotal:{
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  orderItems: [SingleOrderItemSchema],
  status:{
    type: String,
    enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
    default: 'pending'
  },
  user:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  },
  paymentIntentId:{
    type: String
  }
}, {timestamps: true})

module.exports = model('Order', OrderSchema)
