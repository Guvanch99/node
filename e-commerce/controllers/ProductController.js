const { StatusCodes } = require('http-status-codes')
const ProductService = require('../services/ProductService')

class ProductController{
  async createProduct(req,res){
    const product = await ProductService.createProduct(req)
    res.status(StatusCodes.CREATED).json(product)
  }
  async getAllProducts(req,res){
    const products = await ProductService.getAllProducts()
    res.status(StatusCodes.OK).json(products)
  }
  async getSingleProduct(req,res){
    const product = await ProductService.getSingleProduct(req.params.id)
    res.status(StatusCodes.OK).json(product)
  }
  async updateProduct(req,res){
   const product = await ProductService.updateProduct(req.params.id, req.body)
    res.status(StatusCodes.OK).json(product)
  }
  async deleteProduct(req,res){
    await ProductService.deleteProduct(req.params.id)
    res.status(StatusCodes.OK).json({msg:'Success'})
  }
  async getSingleProductReviews(req, res ){
    const reviews =await ProductService.singleProductReview(req.params.id)
    res.status(StatusCodes.OK).json(reviews)
  }
}

module.exports = new ProductController()
