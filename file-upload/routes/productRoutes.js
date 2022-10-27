const router = require('express').Router()
const ProductController = require('../controllers/productController')
const UploadsController = require('../controllers/uploadsController')

router.route('/').post(ProductController.createProduct).get(ProductController.getAllProducts)
router.route('/uploads').post(UploadsController.uploadProductImage)

module.exports = router
