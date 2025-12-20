const Order = require('../models/Order');
const Product = require('../models/Product');
const Voucher = require('../models/Voucher');
const User = require('../models/User');
const { sendPaymentSuccessEmail } = require('../config/email');
const crypto = require('crypto');
const querystring = require('querystring');
const axios = require('axios');
const Cart = require('../models/Cart');

// Tạo đơn hàng và trừ số lượng sản phẩm, voucher
const createOrder = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
        }

        const { items, shippingAddress, voucherId, voucherCode, totalAmount, payment, shippingMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
        }

        if (!shippingAddress || !shippingAddress.fullAddress) {
            return res.status(400).json({ success: false, message: 'Thiếu địa chỉ giao hàng' });
        }

        if (!shippingMethod) {
            return res.status(400).json({ success: false, message: 'Thiếu phương thức vận chuyển' });
        }

        // Kiểm tra và trừ số lượng sản phẩm
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm: ${item.name}` });
            }

            if (!product.variants || product.variants.length === 0) {
                return res.status(400).json({ success: false, message: `Sản phẩm ${item.name} không có biến thể` });
            }

            const variant = product.variants[item.variantIndex];
            if (!variant) {
                return res.status(400).json({ success: false, message: `Không tìm thấy biến thể cho sản phẩm ${item.name}` });
            }

            if (variant.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm ${item.name} (Size: ${variant.size}) chỉ còn ${variant.stock} sản phẩm`
                });
            }

            variant.stock -= item.quantity;
            await product.save();
        }

        // Xử lý voucher nếu có
        let voucher = null;
        if (voucherId || voucherCode) {
            voucher = await Voucher.findById(voucherId) || await Voucher.findOne({ code: voucherCode });
            voucher.usedCount = (voucher.usedCount || 0) + 1;
            await voucher.save();
        }

        // Tạo đơn hàng
        const order = new Order({
            userId,
            items,
            shippingAddress,
            voucherId: voucher?._id,
            voucherCode: voucher?.code,
            totalAmount,
            payment: {
                method: payment.method || 'VNPAY',
                status: 'pending'
            },
            shippingMethod,
            status: 'pending'
        });

        await order.save();

        return res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công',
            order: {
                _id: order._id,
                orderId: order._id.toString()
            }
        });
    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng: ' + error.message });
    }
};

// Tạo URL thanh toán ZALOPAY sandbox
const createZaloPayPaymentUrl = async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        const { userId } = req.user;

        if (!orderId || !amount) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin đơn hàng' });
        }

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        // ZALOPAY Sandbox config
        const appId = process.env.ZALOPAY_APP_ID || '2553';
        const key1 = process.env.ZALOPAY_KEY1 || 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL';
        const key2 = process.env.ZALOPAY_KEY2 || 'kLtgPl8HHhfvMuJHP7Xk1s4QYx5XaXE5';
        const endpoint = 'https://sb-openapi.zalopay.vn/v2/create';
        const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment-callback/zalopay`;

        // Log callback URL để debug
        console.log('\n=== ZaloPay Payment URL Creation ===');
        console.log('BACKEND_URL:', process.env.BACKEND_URL);
        console.log('Callback URL:', callbackUrl);
        console.log('=====================================\n');

        // Tạo transaction ID - Format: yyMMdd_xxxxxxxxx (ví dụ: 251120_1234567890123)
        const transID = Date.now().toString();
        const now = new Date();
        const year = String(now.getFullYear()).substring(2); // Lấy 2 số cuối của năm
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const appTransId = `${year}${month}${day}_${transID}`;

        // Embed data với redirect URL
        const embedData = JSON.stringify({
            redirecturl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-callback?orderId=${orderId}&paymentMethod=ZALOPAY`
        });

        // Tạo danh sách items - đảm bảo các giá trị hợp lệ
        const items = order.items.map(item => ({
            itemid: item.productId.toString().substring(0, 50), // Giới hạn độ dài
            itemname: String(item.name || 'San pham').substring(0, 200), // Giới hạn độ dài
            itemprice: Math.round(Number(item.price) || 0), // Đảm bảo là số nguyên
            itemquantity: Math.max(1, Math.round(Number(item.quantity) || 1)) // Đảm bảo >= 1
        }));

        // Kiểm tra items hợp lệ
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Danh sách sản phẩm không hợp lệ' });
        }

        // Tạo order data 
        // Đảm bảo tất cả giá trị đều hợp lệ
        const orderData = {
            app_id: String(appId),
            app_trans_id: String(appTransId),
            app_user: String(userId),
            app_time: Date.now(),
            amount: Math.round(Number(amount)),
            item: JSON.stringify(items),
            description: String(`Thanh toan don hang ${orderId}`).substring(0, 255),
            embed_data: embedData,
            // bank_code: 'zalopayapp', // Chỉ hiển thị QR code
            callback_url: callbackUrl
        };

        // Kiểm tra amount hợp lệ
        if (orderData.amount <= 0 || isNaN(orderData.amount)) {
            return res.status(400).json({ success: false, message: 'Số tiền không hợp lệ' });
        }

        // Tạo MAC (Message Authentication Code) - thứ tự quan trọng
        // Đảm bảo tất cả giá trị đều là string khi tạo MAC
        const macData = `${String(orderData.app_id)}|${String(orderData.app_trans_id)}|${String(orderData.app_user)}|${String(orderData.amount)}|${String(orderData.app_time)}|${String(orderData.embed_data)}|${String(orderData.item)}`;
        const mac = crypto.createHmac('sha256', key1).update(macData).digest('hex');
        orderData.mac = mac;

        // Gọi API ZALOPAY - ZaloPay API v2 yêu cầu gửi dưới dạng form-urlencoded
        // Tạo form-urlencoded string thủ công để kiểm soát tốt hơn
        const formDataParts = [];
        Object.keys(orderData).forEach(key => {
            const value = orderData[key];
            // Không encode các giá trị JSON string (item, embed_data)
            if (key === 'item' || key === 'embed_data') {
                formDataParts.push(`${key}=${encodeURIComponent(value)}`);
            } else {
                formDataParts.push(`${key}=${encodeURIComponent(String(value))}`);
            }
        });
        const formData = formDataParts.join('&');

        const response = await axios.post(endpoint, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data && response.data.return_code === 1) {
            // Lưu transaction ID vào order
            order.payment.transactionId = appTransId;
            await order.save();

            const cart = await Cart.findOne({ userId });
            cart.items = [];
            await cart.save();

            return res.status(200).json({
                success: true,
                paymentUrl: response.data.order_url,
                orderId: orderId.toString(),
                appTransId
            });
        } else {
            return res.status(400).json({
                success: false,
                message: response.data?.return_message || 'Lỗi khi tạo URL thanh toán ZALOPAY'
            });
        }
    } catch (error) {
        console.error('Lỗi khi tạo URL thanh toán ZALOPAY:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi tạo URL thanh toán: ' + error.message });
    }
};

// Xử lý callback từ ZALOPAY
const handleZaloPayCallback = async (req, res) => {
    try {

        const { orderId, amount } = req.body;
        const order = await Order.findOne({ _id: orderId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        if (amount !== order.totalAmount) {
            return res.status(400).json({ success: false, message: 'Số tiền không khớp' });
        }

        order.payment.status = 'success';
        order.status = 'paid';
        await order.save();
        // Gửi email thông báo thanh toán thành công
        try {
            const user = await User.findById(order.userId);
            if (user && user.email) {
                const orderData = {
                    orderId: order._id.toString(),
                    totalAmount: order.totalAmount,
                    items: order.items,
                    createdAt: order.createdAt,
                    shippingAddress: order.shippingAddress
                };

                // Gửi email bất đồng bộ (không chờ kết quả)
                sendPaymentSuccessEmail("dinhhieu3072004@gmail.com", orderData)
                    .then(() => {
                        console.log(`✅ Đã gửi email thông báo thanh toán thành công cho đơn hàng ${order._id}`);
                    })
                    .catch((error) => {
                        console.error(`❌ Lỗi gửi email cho đơn hàng ${order._id}:`, error.message);
                    });
            } else {
                console.warn(`⚠️ Không tìm thấy email của user ${order.userId} để gửi thông báo`);
            }
        } catch (emailError) {
            console.error('❌ Lỗi khi gửi email thông báo:', emailError.message);
        }

        return res.status(200).json({ success: true, message: 'Xử lý callback thanh toán ZALOPAY thành công' });
    } catch (error) {
        console.error('❌ Lỗi khi xử lý callback ZALOPAY:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi xử lý callback thanh toán ZALOPAY' });
    }
};

// Lấy danh sách đơn hàng của user
const getOrders = async (req, res) => {
    try {
        const { userId } = req.user;
        const { status } = req.query; // Filter theo status từ frontend: PENDING, SHIPPING, DELIVERED, RETURNED

        // Map status từ frontend sang backend
        const statusMap = {
            'PENDING': ['pending', 'paid'],      // Chờ xác nhận
            'SHIPPING': 'shipped',     // Đang giao
            'DELIVERED': 'delivered',  // Đã giao
            'RETURNED': ['cancelled', 'refunded', 'return_requested'] // Trả hàng/Hoàn tiền
        };

        // Xây dựng query
        const query = { userId };
        if (status && statusMap[status]) {
            if (Array.isArray(statusMap[status])) {
                // RETURNED bao gồm cả cancelled và refunded
                query.status = { $in: statusMap[status] };
            } else {
                query.status = statusMap[status];
            }
        }

        const orders = await Order.find(query)
            .populate('items.productId', 'name images variants')
            .sort({ createdAt: -1 })
            .lean();

        // Format lại dữ liệu để khớp với frontend
        const formattedOrders = orders.map(order => {
            // Map status từ backend sang frontend
            const reverseStatusMap = {
                'pending': 'PENDING',
                'paid': 'PENDING',
                'shipped': 'SHIPPING',
                'delivered': 'DELIVERED',
                'cancelled': 'RETURNED',
                'refunded': 'RETURNED'
            };

            // Format items để khớp với frontend
            const formattedItems = order.items.map(item => {
                // Lấy size từ variant nếu có
                let size = '';
                if (item.productId && item.productId.variants && item.variantIndex !== undefined) {
                    const variant = item.productId.variants[item.variantIndex];
                    if (variant && variant.size) {
                        size = variant.size;
                    }
                }

                // Fallback: extract size từ SKU nếu không có variant
                if (!size && item.sku) {
                    // SKU format có thể là "NB530K A37" hoặc "NB530K-37" hoặc chỉ "37"
                    const parts = item.sku.split(/[\s-]/);
                    size = parts[parts.length - 1] || '';
                }

                return {
                    productId: item.productId?._id?.toString() || item.productId?.toString() || '',
                    variantIndex: item.variantIndex || 0,
                    name: item.name,
                    sku: item.sku,
                    finalPrice: item.price || 0,
                    quantity: item.quantity,
                    image: item.productId?.images?.[0] || '',
                    size: size
                };
            });

            return {
                _id: order._id.toString(),
                items: formattedItems,
                totalAmount: order.totalAmount,
                shippingStatus: reverseStatusMap[order.status] || 'PENDING',
                createdAt: order.createdAt.toISOString()
            };
        });

        return res.status(200).json({
            success: true,
            data: formattedOrders // Frontend đang expect result.data
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng' });
    }
};

// Lấy chi tiết đơn hàng
const getOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;

        const order = await Order.findOne({ _id: orderId, userId })
            .populate('items.productId', 'name images slug')
            .populate('voucherId')
            .lean();

        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết đơn hàng' });
    }
};

// [ADMIN] Lấy tất cả đơn hàng của hệ thống
const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // TÍNH TOÁN THỐNG KÊ (Đếm toàn bộ database, không phụ thuộc phân trang)
        // Dùng Promise.all để chạy song song các lệnh đếm cho nhanh
        const [
            totalOrders,
            pendingCount,
            shippingCount,
            deliveredCount,
            returnedCount
        ] = await Promise.all([
            Order.countDocuments(), // Tổng số đơn
            Order.countDocuments({ status: { $in: ['pending', 'paid'] } }), // Chờ duyệt
            Order.countDocuments({ status: 'shipped' }), // Đang giao
            Order.countDocuments({ status: 'delivered' }), // Đã giao
            Order.countDocuments({ status: { $in: ['cancelled', 'refunded', 'return_requested'] } }) // Hoàn trả/Hủy
        ]);

        const totalPages = Math.ceil(totalOrders / limit);

        //  LẤY DANH SÁCH ĐƠN HÀNG (Có phân trang)
        const orders = await Order.find()
            .populate('userId', 'fullname email phone')
            .populate('items.productId', 'name images variants')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        //  FORMAT DỮ LIỆU
        const formattedOrders = orders.map(order => {
            const reverseStatusMap = {
                'pending': 'PENDING', 'paid': 'PENDING',
                'shipped': 'SHIPPING',
                'delivered': 'DELIVERED',
                'return_requested': 'RETURNED', 'refunded': 'RETURNED', 'cancelled': 'RETURNED'
            };

            // Format items để hiển thị trong modal
            let formattedItems = [];
            if (order.items && Array.isArray(order.items) && order.items.length > 0) {
                formattedItems = order.items.map(item => {
                    let size = '';
                    // Lấy size từ variant nếu có
                    if (item.productId && item.productId.variants && Array.isArray(item.productId.variants) && item.variantIndex !== undefined && item.variantIndex >= 0) {
                        const variant = item.productId.variants[item.variantIndex];
                        if (variant && variant.size) {
                            size = variant.size;
                        }
                    }
                    // Fallback: extract size từ SKU nếu không có variant
                    if (!size && item.sku) {
                        const parts = item.sku.split(/[\s-]/);
                        size = parts[parts.length - 1] || '';
                    }

                    return {
                        productId: item.productId?._id?.toString() || item.productId?.toString() || '',
                        name: item.name || 'N/A',
                        sku: item.sku || 'N/A',
                        price: item.price || 0,
                        quantity: item.quantity || 0,
                        image: item.productId?.images?.[0] || '',
                        size: size || ''
                    };
                });
            }

            return {
                _id: order._id.toString(),
                customer: order.userId,
                shippingAddress: order.shippingAddress,
                items: formattedItems,
                totalAmount: order.totalAmount,
                shippingStatus: reverseStatusMap[order.status] || 'PENDING',
                originalStatus: order.status,
                createdAt: order.createdAt.toISOString(),
                payment: order.payment,
                shippingMethod: order.shippingMethod,
                voucherCode: order.voucherCode
            };
        });

        return res.status(200).json({
            success: true,
            data: formattedOrders,
            pagination: { page, limit, totalPages, totalOrders },
            // 👇 TRẢ VỀ THÊM OBJECT STATS 👇
            stats: {
                total: totalOrders,
                pending: pendingCount,
                shipping: shippingCount,
                delivered: deliveredCount,
                returned: returnedCount
            }
        });
    } catch (error) {
        console.error('Lỗi Admin get all orders:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [ADMIN] Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body; // status gửi lên: 'shipped', 'delivered', 'cancelled'

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
const requestReturnOrder = async (req, res) => {
    try {
        const { userId } = req.user;
        const { orderId, reason } = req.body; // Lý do trả hàng (nếu cần)

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        // Chỉ cho phép trả hàng khi trạng thái là 'delivered' (đã giao)
        if (order.status !== 'delivered') {
            return res.status(400).json({ success: false, message: 'Đơn hàng chưa được giao thành công, không thể yêu cầu hoàn trả.' });
        }

        order.status = 'return_requested'; // Chuyển sang trạng thái chờ admin duyệt hoàn tiền
        await order.save();

        return res.status(200).json({ success: true, message: 'Đã gửi yêu cầu hoàn trả. Vui lòng chờ Admin xác nhận.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [ADMIN] Lấy dữ liệu dashboard
const getDashboardData = async (req, res) => {
    try {
        const { period = 'month' } = req.query; // 'today', 'week', 'month', 'year'
        
        // Tính toán khoảng thời gian
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        //Doanh thu theo ngày (cho biểu đồ line)
        const revenueByDate = await Order.aggregate([
            {
                $match: {
                    status: 'delivered',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        //Thống kê trạng thái đơn hàng (cho biểu đồ pie)
        const orderStatusStats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        //Top sản phẩm bán chạy
        const topProducts = await Order.aggregate([
            {
                $match: {
                    status: 'delivered',
                    createdAt: { $gte: startDate }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    productName: { $first: '$items.name' }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    productId: '$_id',
                    name: '$productName',
                    image: { $arrayElemAt: ['$product.images', 0] },
                    totalQuantity: 1,
                    totalRevenue: 1
                }
            }
        ]);

        //Cảnh báo tồn kho (sản phẩm có stock thấp)
        const Product = require('../models/Product');
        const lowStockProducts = await Product.find({
            $or: [
                { 'variants.stock': { $lte: 10, $gte: 0 } },
                { 'variants.stock': { $exists: false } }
            ]
        })
        .select('name images variants')
        .limit(10)
        .lean();

        // Format low stock products và sắp xếp theo mức độ nguy hiểm (stock thấp nhất trước)
        const formattedLowStock = [];
        lowStockProducts.forEach(product => {
            product.variants.forEach((variant, index) => {
                // Chỉ lấy variants có stock <= 10 và >= 0 (không lấy stock âm)
                if (variant.stock !== undefined && variant.stock !== null && variant.stock <= 10 && variant.stock >= 0) {
                    formattedLowStock.push({
                        productId: product._id.toString(),
                        name: product.name,
                        image: product.images[0] || '',
                        sku: variant.sku,
                        size: variant.size,
                        stock: variant.stock,
                        variantIndex: index
                    });
                }
            });
        });
        
        // Sắp xếp theo stock tăng dần (stock thấp nhất = nguy hiểm nhất sẽ hiển thị trước)
        formattedLowStock.sort((a, b) => a.stock - b.stock);

        // 5. Đơn hàng gần đây (5 đơn mới nhất)
        const recentOrders = await Order.find()
            .populate('userId', 'fullname email')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const formattedRecentOrders = recentOrders.map(order => {
            const reverseStatusMap = {
                'pending': 'PENDING', 'paid': 'PENDING',
                'shipped': 'SHIPPING',
                'delivered': 'DELIVERED',
                'return_requested': 'RETURNED', 'refunded': 'RETURNED', 'cancelled': 'RETURNED'
            };

            return {
                _id: order._id.toString(),
                customerName: order.userId?.fullname || 'Khách lẻ',
                customerEmail: order.userId?.email || '',
                totalAmount: order.totalAmount,
                status: reverseStatusMap[order.status] || 'PENDING',
                originalStatus: order.status,
                createdAt: order.createdAt.toISOString()
            };
        });

        // 6. Tổng doanh thu trong khoảng thời gian
        const totalRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'delivered',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                revenueByDate: revenueByDate.map(item => ({
                    date: item._id,
                    revenue: item.revenue
                })),
                orderStatusStats: orderStatusStats.map(item => ({
                    status: item._id,
                    count: item.count
                })),
                topProducts: topProducts.map(item => ({
                    productId: item.productId?.toString() || '',
                    name: item.name,
                    image: item.image || '',
                    totalQuantity: item.totalQuantity,
                    totalRevenue: item.totalRevenue
                })),
                lowStockProducts: formattedLowStock,
                recentOrders: formattedRecentOrders,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        console.error('Lỗi Admin get dashboard data:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = {
    createOrder,
    createZaloPayPaymentUrl,
    handleZaloPayCallback,
    getOrders,
    getOrderDetail,
    getAllOrders,
    updateOrderStatus,
    requestReturnOrder,
    getDashboardData
};
