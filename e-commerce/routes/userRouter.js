const userRouter = require('express').Router()
const UserController = require('../controllers/UserController')
const {authenticateUser, authorizePermissions} = require('../middleware/authentication')
//TODO permission to ADMIN
userRouter.route('/').get(
  authenticateUser,
  authorizePermissions(['USER', 'ADMIN']),
  UserController.getAllUsers
)
userRouter.route('/showMe').get(UserController.showCurrentUser)
userRouter.route('/updateUser').patch(authenticateUser,UserController.updateUser)
userRouter.route('/updateUserPassword').patch(authenticateUser,UserController.updateUserPassword)
userRouter.route('/:id').get(authenticateUser, authorizePermissions(['USER', 'ADMIN']), UserController.getSingleUser)


module.exports = userRouter
