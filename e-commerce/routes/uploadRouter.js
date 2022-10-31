const uploadRouter = require('express').Router()
const UploadImageController = require('../controllers/UploadImageController')
const {authenticateUser, authorizePermissions} = require('../middleware/authentication')

uploadRouter.post(
  '/',
  [authenticateUser, authorizePermissions(['ADMIN', "USER"])],
  UploadImageController.uploadImage)

module.exports = uploadRouter
