const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')

class ProductController{
  async createProduct(req, res){
    const product = Product.create(req.body)
    res.status(StatusCodes.CREATED).json(product)
  }
  async getAllProducts(req, res){
    const allProducts = await Product.find({})

    res.status(StatusCodes.OK).json(allProducts)
  }

}

module.exports = new ProductController()
