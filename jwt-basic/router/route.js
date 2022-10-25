const router = require('express').Router()
const { check } = require('express-validator')
const AuthController = require('../controllers/authController')
const authMiddleware = require('../middleware/authentication')
const roleMiddleware = require('../middleware/roleMiddleware')
router.post(
  '/registration',
  check('username', 'Must be username').notEmpty(),
  check('password', 'Must be password').isLength({min:4, max:10}),
  AuthController.registration
)
router.post('/login', AuthController.login)
router.get('/users', roleMiddleware(['Users']), AuthController.getUsers)


module.exports = router
