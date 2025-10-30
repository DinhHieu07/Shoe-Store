const express = require('express');
const { registerCustomer, loginCustomer, googleLogin, logoutCustomer } = require('../controllers/customerController');
const { refreshToken } = require('../controllers/refreshToken');
const { getAllProducts, addProduct, editProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { addCategory, getCategories } = require('../controllers/categoryController');
const { validateEmail, verifyOTP, changePassword } = require('../controllers/forgotPassController');
const router = express.Router();

// Public routes (không cần authentication)
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/google-login', googleLogin);
router.post('/refresh-token', refreshToken);
router.get('/get-categories', getCategories);
router.get('/get-products', getAllProducts);
router.post('/validate-email', validateEmail);
router.post('/verify-otp', verifyOTP);
router.post('/change-password', changePassword);

// Protected routes (cần authentication)
router.post('/logout', authMiddleware, logoutCustomer);

// Admin routes (cần authentication + admin role)
router.post('/add-category', authMiddleware, roleMiddleware(['admin']), addCategory);
router.post('/add-product', authMiddleware, roleMiddleware(['admin']), addProduct);
router.delete('/delete-product/:id', authMiddleware, roleMiddleware(['admin']), deleteProduct);
router.put('/edit-product/:id', authMiddleware, roleMiddleware(['admin']), editProduct);

module.exports = router;