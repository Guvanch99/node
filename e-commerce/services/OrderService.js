const Order = require('../models/Order')
const Product = require('../models/Product')
const UserService = require('../services/UserService')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors")

const fakeStripeApi = async ({amount, currency})=>{
  const client_secret  ='Some random value'

  return {client_secret, amount}
}

class OrderService{

  async createOrder(req){
    const { items: cartItems, tax, shippingFee } = req.body
    if(!cartItems|| !cartItems.length){
      throw new BadRequestError('No cart items')
    }
    if(!tax|| !shippingFee){
      throw new BadRequestError('Please provide tax and shipping fee')
    }

    let orderItems = []
    let subTotal = 0
    for(const item of cartItems){
      const dbProduct = await Product.findOne({_id:item.product})
      if(!dbProduct){
        throw new NotFoundError(`No Product with id ${item.product}`)
      }
      const { name, price, image, _id } = dbProduct
      const singleOrderItem={
        name,
        price,
        Image: image,
        amount: item.amount,
        product: _id
      }

      orderItems = [...orderItems, singleOrderItem]
      subTotal += item.amount * price
    // return await Order.create(req.body)
  }
    const total = tax + shippingFee + subTotal
    const paymentIntent = await fakeStripeApi({
      amount:total,
      currency:'usd'
    })

    const order = await Order.create({
      orderItems,
      total,
      subTotal,
      tax,
      shippingFee,
      clientSecret:paymentIntent.client_secret,
      user: req.user.userId
    })

    return order
  }
  async getAllOrders(){
    return await Order.find({})
  }
  async getSingleOrder(id, req){
    const order = await Order.findOne({_id:id})
    if(!order){
      throw new NotFoundError('Invalid order id')
    }
    UserService.checkPermissions(req.user, order.user)
    return order
  }
  async getCurrentUserOrders(id){
    const order = await Order.findOne({_id:id})
    if(!order){
      throw new NotFoundError('Invalid order id')
    }
    return order
  }
  async updateOrder(id, updates, req){
    const { paymentIntentId }=updates
    const order = await Order.findOne({_id:id})
    if(!order){
      throw new NotFoundError('Invalid order id')
    }
    UserService.checkPermissions(req.user, order.user)
    order.paymentIntentId= paymentIntentId
    order.status = 'paid'
    await order.save()
    return order
  }
}

module.exports = new OrderService()
