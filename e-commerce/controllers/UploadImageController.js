const path = require("path")
const fs = require("fs")
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
class UploadImageController{

  async uploadImage(req,res){
    if(!req.files){
      throw new CustomError.BadRequestError('There is no file')
    }
    const productImage = req.files.image

    if(!productImage.mimetype.startsWith('image')){
      throw new CustomError.BadRequestError('Please upload a image')
    }

    const directoryUploads = path.join(__dirname, '../public/uploads/')
    const imagePath = path.join(directoryUploads +`${productImage.name}`)
    if(!fs.existsSync(directoryUploads)){
      fs.mkdir(directoryUploads,{recursive: true}, (err)=>console.log('err'));
    }
    await productImage.mv(imagePath)

    res.status(StatusCodes.OK).json({image:`/uploads/${productImage.name}`})
  }
}

module.exports = new UploadImageController()
