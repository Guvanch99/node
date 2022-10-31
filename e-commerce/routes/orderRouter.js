const orderRouter = require('express').Router()
const OrderController =require('../controllers/OrderController')
const {authenticateUser, authorizePermissions} = require('../middleware/authentication')
//TODO ADMIN
orderRouter.route('/')
  .post(authenticateUser, OrderController.createOrder)
  .get(authenticateUser,authorizePermissions(['ADMIN']),OrderController.getAllOrders)

orderRouter.route('/showAllMyOrders').get(OrderController.getCurrentUserOrders)

orderRouter
  .route('/:id')
  .get(authenticateUser, OrderController.getSingleOrder)
  .patch(authenticateUser,OrderController.updateOrder)


module.exports = orderRouter
