const express = require('express')

const router = express.Router()

const {register, login, logout, verifyEmail, forgotPassword, resetPassword} = require('../controllers/authController')
const authenticateUser = require('../middlewares/authenticate')

router.post('/register', register)
router.post('/login', login)
router.delete('/logout',authenticateUser,logout)
router.post('/verify-email', verifyEmail)
router.post('/forgot-Password', forgotPassword)
router.post('/reset-Password', resetPassword)



module.exports = router
