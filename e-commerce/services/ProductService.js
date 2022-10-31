const Product = require('../models/Product')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors")
const Review = require("../models/Review");

class ProductService{

  async createProduct(req){
    req.body.user = req.user.userId
    return await Product.create(req.body)
  }
  async getAllProducts(){
    return await Product.find({}).populate('reviews')
  }
  async getSingleProduct(id){
    const product = await Product.findOne({_id:id}).populate('reviews')
    if(!product){
      throw new NotFoundError('Invalid product id')
    }
    return product
  }
  async deleteProduct(id){
    const product = await Product.findOne({_id:id})
    if(!product){
      throw new NotFoundError('Invalid product id')
    }
   await product.remove()
  }
  async updateProduct(id, updates){
    const product =  await Product.findOneAndUpdate({_id:id},updates, {new:true, runValidators:true} )
    if(!product){
      throw new NotFoundError('Invalid product id')
    }
    return product
  }

  async singleProductReview(id){
    return Review.find({product: id});
  }
}

module.exports = new ProductService()
