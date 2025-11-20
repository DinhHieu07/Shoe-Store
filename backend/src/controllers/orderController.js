const Order = require('../models/Order');
const Product = require('../models/Product');
const Voucher = require('../models/Voucher');
const User = require('../models/User');
const { sendPaymentSuccessEmail } = require('../config/email');
const crypto = require('crypto');
const querystring = require('querystring');
const axios = require('axios');

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
            bank_code: 'zalopayapp',
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
    // Set CORS headers để cho phép ZaloPay gọi callback
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log('✅ OPTIONS preflight request received');
        return res.status(200).end();
    }
    
    // Log chi tiết để debug
    console.log('\n🔔 === ZaloPay Callback Received ===');
    console.log('Time:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Original URL:', req.originalUrl);
    console.log('IP:', req.ip || req.connection.remoteAddress);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', JSON.stringify(req.query, null, 2));
    console.log('====================================\n');
    
    // Response object theo format của ZaloPay (theo tài liệu)
    const result = {
        return_code: 0,
        return_message: ''
    };
    
    try {
        // Theo tài liệu: Content-Type là application/json
        // Body có format: { data: string (JSON string), mac: string, type: int }
        const { data, mac, type } = req.body;
        
        if (!data || !mac) {
            console.error('❌ Callback thiếu data hoặc mac');
            result.return_code = -1;
            result.return_message = 'Thiếu thông tin callback';
            return res.json(result);
        }
        
        const key2 = process.env.ZALOPAY_KEY2 || 'kLtgPl8HHhfvMuJHP7Xk1s4QYx5XaXE5';

        // Verify MAC - Theo tài liệu: dùng key2 để verify
        // MAC được tính từ data string (không phải base64)
        const checkMac = crypto.createHmac('sha256', key2).update(data).digest('hex');
        if (checkMac !== mac) {
            console.error('❌ MAC không hợp lệ');
            console.log('Expected MAC:', checkMac);
            console.log('Received MAC:', mac);
            result.return_code = -1;
            result.return_message = 'mac not equal';
            return res.json(result);
        }

        // Parse data - Theo tài liệu: data là JSON string (không phải base64!)
        // Nhưng trong ví dụ có thể là base64, nên thử cả hai cách
        let callbackData;
        try {
            // Thử parse như JSON string trước (theo tài liệu)
            callbackData = JSON.parse(data);
        } catch (parseError) {
            // Nếu không được, thử base64 (có thể sandbox dùng base64)
            try {
                callbackData = JSON.parse(Buffer.from(data, 'base64').toString());
                console.log('⚠️ Data được parse từ base64 (sandbox có thể dùng base64)');
            } catch (base64Error) {
                console.error('❌ Không thể parse callback data:', parseError.message);
                result.return_code = -1;
                result.return_message = 'Invalid data format';
                return res.json(result);
            }
        }
        
        const { app_trans_id } = callbackData;
        
        // Theo tài liệu: Nếu callback được gọi nghĩa là thanh toán thành công
        // Callback data không có return_code, chỉ có app_trans_id và các thông tin khác
        console.log('✅ Callback data parsed:', JSON.stringify(callbackData, null, 2));
        console.log('Type:', type, '(1=Order, 2=Agreement)');

        // Tìm order theo transaction ID
        const orders = await Order.find({ 'payment.transactionId': app_trans_id });
        if (orders.length === 0) {
            console.error('❌ Không tìm thấy đơn hàng với app_trans_id:', app_trans_id);
            result.return_code = -1;
            result.return_message = 'Order not found';
            return res.json(result);
        }

        const order = orders[0];
        
        // Kiểm tra amount để đảm bảo đúng (nếu có trong callback data)
        if (callbackData.amount && callbackData.amount !== order.totalAmount) {
            console.warn('⚠️ Amount không khớp:', callbackData.amount, 'vs', order.totalAmount);
        }
        
        // Theo tài liệu: Nếu callback đến nghĩa là thanh toán thành công
        // Cập nhật đơn hàng thành công
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
                    sendPaymentSuccessEmail(user.email, orderData)
                        .then(() => {
                            console.log(`✅ Đã gửi email thông báo thanh toán thành công cho đơn hàng ${order._id}`);
                        })
                        .catch((error) => {
                            console.error(`❌ Lỗi gửi email cho đơn hàng ${order._id}:`, error.message);
                            // Không throw error để không ảnh hưởng đến callback response
                        });
                } else {
                    console.warn(`⚠️ Không tìm thấy email của user ${order.userId} để gửi thông báo`);
                }
            } catch (emailError) {
                console.error('❌ Lỗi khi gửi email thông báo:', emailError.message);
                // Không throw error để không ảnh hưởng đến callback response
            }

        // Theo tài liệu: Response phải có return_code = 1 và return_message = 'success'
        result.return_code = 1;
        result.return_message = 'success';
        console.log(`✅ Order ${order._id} đã được cập nhật thành công`);
        return res.json(result);
    } catch (error) {
        console.error('❌ Lỗi khi xử lý callback ZALOPAY:', error);
        // Theo tài liệu: return_code = 0 để callback lại (tối đa 3 lần)
        result.return_code = 0;
        result.return_message = error.message || 'Error';
        return res.json(result);
    }
};

// Lấy danh sách đơn hàng của user
const getOrders = async (req, res) => {
    try {
        const { userId } = req.user;
        const orders = await Order.find({ userId })
            .populate('items.productId', 'name images')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({ success: true, orders });
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

module.exports = {
    createOrder,
    createZaloPayPaymentUrl,
    handleZaloPayCallback,
    getOrders,
    getOrderDetail
};
