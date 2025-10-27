const express = require('express');
const { registerCustomer, loginCustomer, googleLogin, logoutCustomer } = require('../controllers/customerController');
const { refreshToken } = require('../controllers/refreshToken');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (không cần authentication)
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/google-login', googleLogin);
router.post('/refresh-token', refreshToken);

// Protected routes (cần authentication)
router.post('/logout',authMiddleware, logoutCustomer);

// Admin routes (cần authentication + admin role)

module.exports = router;