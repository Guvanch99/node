const { StatusCodes } = require('http-status-codes')
const OrderService = require('../services/OrderService')

class OrderController{
  async createOrder(req,res){
    const order = await OrderService.createOrder(req)
    res.status(StatusCodes.CREATED).json({order, clientSecret:order.clientSecret})
  }
  async getCurrentUserOrders(req,res){
    const order = await OrderService.getCurrentUserOrders(req.user.userId)
    res.status(StatusCodes.CREATED).json(order)
  }
  async getAllOrders(req,res){
    const order = await OrderService.getAllOrders()
    res.status(StatusCodes.OK).json(order)
  }
  async getSingleOrder(req,res){
    const order = await OrderService.getSingleOrder(req.params.id, req)
    res.status(StatusCodes.OK).json(order)
  }
  async updateOrder(req,res){
    const order = await OrderService.updateOrder(req.params.id, req.body, req)
    res.status(StatusCodes.OK).json(product)
  }
}

module.exports = new OrderController()
