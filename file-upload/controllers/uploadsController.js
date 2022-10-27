const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

class UploadsController{
  async uploadProductLocalImage(req, res){
    if(!req.files){
      throw new CustomError.BadRequestError('No File Uploaded')
    }
    const productImage = req.files.image
    if(!productImage.mimetype.startsWith('image')){
      throw new CustomError.BadRequestError('Not the image')
    }
    const directoryUploads = path.join(__dirname, '../public/uploads/')
    const imagePath = path.join(directoryUploads +`${productImage.name}`)

    if(!fs.existsSync(directoryUploads)){
      fs.mkdir(directoryUploads,{recursive: true}, (err)=>console.log('err'));
    }
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({img:{src:`/uploads/${productImage.name}`}})
  }

 async uploadProductImage(req,res){
  const result = await cloudinary.uploader
      .upload(
        req.files.image.tempFilePath, {
          use_filename:true,
          folder:'file-upload'
      })
  fs.unlinkSync(req.files.image.tempFilePath)
   console.log('res', result)
  res.status(StatusCodes.OK).json({img: {src: result.secure_url}})
  }

}

module.exports = new UploadsController()
