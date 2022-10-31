const Review = require('../models/Review')
const Product = require('../models/Product')
const UserService = require('../services/UserService')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors")

class ReviewService{

  async createReview(req){
    const { product: productId } = req.body
    const isValidProduct = await Product.findOne({_id: productId})
    if (!isValidProduct){
      throw new NotFoundError(`No review with this id: ${productId}`)
    }
    const alreadySubmitted = await Review.findOne({ _id: productId, user:req.user.userId })
    if(alreadySubmitted){
      throw new BadRequestError('Product already submitted')
    }
    req.body.user = req.user.userId
    return await Review.create(req.body)
  }
  async getAllReviews(){
    return await Review.find({})
      .populate({path:'product', select:'name company price'})
      .populate({path:'user', select:'name'})
  }
  async getSingleReview(id){
    const review = await Review.findOne({_id:id})
    if(!review){
      throw new NotFoundError('Invalid review id')
    }
    return review
  }
  async deleteReview(id, req){
    const review = await Review.findOne({_id:id})
    if(!review){
      throw new NotFoundError('Invalid product id')
    }
    UserService.checkPermissions(req.user, review.user)
   await review.remove()
  }
  async updateReview(id, updates){
    const review =  await Review.findOneAndUpdate({_id:id}, updates, {new:true, runValidators:true} )
    if(!review){
      throw new NotFoundError('Invalid product id')
    }
    return review
  }
}

module.exports = new ReviewService()
