const express = require('express');
const { registerCustomer, loginCustomer, googleLogin, logoutCustomer, getProfile, uploadAvatar, updateProfile } = require('../controllers/customerController');
const { refreshToken } = require('../controllers/refreshToken');
const { getAllProducts, addProduct, editProduct, deleteProduct, getProductDetail } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getVouchers, addVoucher, editVoucher, deleteVoucher, validateVoucher } = require('../controllers/voucherController');
const { addCategory, getCategories } = require('../controllers/categoryController');
const { validateEmail, verifyOTP, changePassword } = require('../controllers/forgotPassController');
const { upload } = require('../middleware/uploadAWSS3');
const { getMessages, getConversations, getMessagesWithUser, markConversationAsRead } = require('../controllers/chatController');
const { addToCart, getCart, deleteItemFromCart, deleteAllItemsFromCart, updateItemQuantity } = require('../controllers/cartController');
const { updateAddress } = require('../controllers/customerController');
const { createOrder, createZaloPayPaymentUrl, handleZaloPayCallback, getOrders, getOrderDetail } = require('../controllers/orderController');
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
router.get('/get-product-detail/:sku', getProductDetail);
router.get('/get-vouchers', getVouchers);
router.post('/validate-voucher', validateVoucher);
router.post('/payment-callback/zalopay', handleZaloPayCallback);

// Protected routes (cần authentication)
router.post('/logout', authMiddleware, logoutCustomer);
router.get('/get-profile', authMiddleware, getProfile);
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.post('/update-profile', authMiddleware, updateProfile);
router.get('/get-messages', authMiddleware, getMessages);
router.post('/add-to-cart', authMiddleware, addToCart);
router.get('/get-cart', authMiddleware, getCart);
router.delete('/delete-item-from-cart/:productId', authMiddleware, deleteItemFromCart);
router.delete('/delete-all-items-from-cart', authMiddleware, deleteAllItemsFromCart);
router.put('/update-item-quantity', authMiddleware, updateItemQuantity);
router.post('/update-address', authMiddleware, updateAddress);
router.post('/create-order', authMiddleware, createOrder);
router.post('/create-payment-url/zalopay', authMiddleware, createZaloPayPaymentUrl);
router.get('/get-orders', authMiddleware, getOrders);
router.get('/get-order-detail/:orderId', authMiddleware, getOrderDetail);

// Admin routes (cần authentication + admin role)
router.post('/add-category', authMiddleware, roleMiddleware(['admin']), addCategory);
router.post('/add-product', authMiddleware, roleMiddleware(['admin']), addProduct);
router.delete('/delete-product/:id', authMiddleware, roleMiddleware(['admin']), deleteProduct);
router.put('/edit-product/:id', authMiddleware, roleMiddleware(['admin']), editProduct);
router.post('/add-voucher', authMiddleware, roleMiddleware(['admin']), addVoucher);
router.put('/edit-voucher/:id', authMiddleware, roleMiddleware(['admin']), editVoucher);
router.delete('/delete-voucher/:id', authMiddleware, roleMiddleware(['admin']), deleteVoucher);
router.get('/get-conversations', authMiddleware, roleMiddleware(['admin']), getConversations);
router.get('/get-messages-with-user/:userId', authMiddleware, roleMiddleware(['admin']), getMessagesWithUser);
router.post('/mark-conversation-as-read/:userId', authMiddleware, roleMiddleware(['admin']), markConversationAsRead);

module.exports = router;