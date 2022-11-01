const express = require('express');
const router = express.Router();

const { register, login, logout, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication')

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);
router.get('/verify-email', verifyEmail);
router.get('/reset-password', resetPassword);
router.get('/forgot-password', forgotPassword);

module.exports = router;
