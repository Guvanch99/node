const mongoose = require('mongoose')

const ReviewModal = mongoose.Schema({
  rating:{
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide rating']
  },
  title:{
    type: String,
    trim:true,
    required: [true, 'Please provide a title'],
    maxlength:100
  },
  comment:{
    type: String,
    required: [true, 'Please provide a comment'],
  },
  product:{
    type: mongoose.Schema.ObjectId,
    ref:'Product',
    required:true
  },
  user:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  }
},{timestamps:true})

ReviewModal.index(
  { product:1, user:1 },
  { unique:true }
)

ReviewModal.statics.calculateAverageRating = async function(productId){

  const result = await this.aggregate([
    { $match:{ product: productId } },
    {
      $group:{
        _id: null,
        averageRating:{
          $avg:'$rating'
        },
        numOfReviews:{ $sum: 1 }
      }
    }
  ])
  console.log('r', result)
  try {
    await this.model('Product').findOneAndUpdate({_id: productId }, {
      averageRating: Math.ceil(result[0]?.averageRating ||  0),
      numOfReviews: result[0]?.averageRating ||  0
    })
  }catch (e){
    console.log('err', e)
  }
}

ReviewModal.post('save', async function(){
  await this.constructor.calculateAverageRating(this.product)
})

ReviewModal.post('remove', async function(){
  await this.constructor.calculateAverageRating(this.product)
})


module.exports = mongoose.model('Review', ReviewModal)
