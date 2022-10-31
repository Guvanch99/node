const productsRouter = require('express').Router()
const ProductController =require('../controllers/ProductController')
const {authenticateUser, authorizePermissions} = require('../middleware/authentication')
//TODO ADMIN
productsRouter.route('')
  .post([authenticateUser, authorizePermissions(['USER','ADMIN'])], ProductController.createProduct)
  .get(ProductController.getAllProducts)

productsRouter
  .route('/:id')
  .get(ProductController.getSingleProduct)
  .patch([authenticateUser, authorizePermissions(['USER','ADMIN'])],ProductController.updateProduct)
  .delete([authenticateUser, authorizePermissions(['USER','ADMIN'])],ProductController.deleteProduct)


productsRouter.route('/:id/reviews').get(ProductController.getSingleProductReviews)

module.exports = productsRouter
