const ReviewService = require('../services/ReviewService')
const StatusCodes = require('http-status-codes')
class ReviewController{

  async createReview(req,res){
    const review = await ReviewService.createReview(req)
    res.status(StatusCodes.CREATED).json(review)
  }
  async getAllReviews(req,res){
    const reviews = await ReviewService.getAllReviews()
    res.status(StatusCodes.OK).json({reviews, count: reviews.length})
  }
  async getSingleReview(req,res){
    const review = await ReviewService.getSingleReview(req.params.id)
    res.status(StatusCodes.OK).json(review)
  }
  async updateReview(req,res) {
    const update = await ReviewService.updateReview(req.params.id, req.body)
    res.status(StatusCodes.OK).json(update)
  }
  async deleteReview(req,res){
    await ReviewService.deleteReview(req.params.id, req)
    res.status(StatusCodes.OK).json({msg:'success'})
  }
}

module.exports = new ReviewController()
