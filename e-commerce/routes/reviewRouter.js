const reviewRouter = require('express').Router()
const ReviewController = require('../controllers/ReviewController')
const {authenticateUser} = require('../middleware/authentication')

reviewRouter
  .route('/')
  .post(authenticateUser, ReviewController.createReview)
  .get(ReviewController.getAllReviews)

reviewRouter
  .route('/:id')
  .get(ReviewController.getSingleReview)
  .patch(authenticateUser,ReviewController.updateReview)
  .delete(authenticateUser,ReviewController.deleteReview)


module.exports = reviewRouter
