const express = require('express');
const { registerCustomer, loginCustomer, googleLogin, logoutCustomer } = require('../controllers/customerController');
const router = express.Router();

// Public routes (không cần authentication)
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/google-login', googleLogin);

// Protected routes (cần authentication)
router.post('/logout', logoutCustomer);

// Admin routes (cần authentication + admin role)

module.exports = router;