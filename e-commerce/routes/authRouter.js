const authRouter = require('express').Router()
const AuthController = require('../controllers/AuthController')

authRouter.post('/register', AuthController.register)
authRouter.post('/login', AuthController.login)
authRouter.get('/logout', AuthController.logout)


module.exports = authRouter
