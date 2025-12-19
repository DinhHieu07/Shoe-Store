require('dotenv').config();

const sendViaResend = async (email, subject, html) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = 'Shoe Store <onboarding@resend.dev>';
    if (!apiKey) throw new Error('RESEND_API_KEY is missing');
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to: [email], subject, html })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(`Resend error: ${res.status} ${res.statusText} ${(data && data.message) || ''}`);
    }
    console.log('✅ Resend email id:', data?.id);
    return { success: true, messageId: data?.id };
}

const sendOTPEmail = async (email, otp) => {
    try {
        const subject = 'Mã OTP đặt lại mật khẩu';
        const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #333; margin-bottom: 20px;">Xin chào!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.
                        </p>
                        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #007bff;">
                            <p style="color: #333; font-size: 14px; margin: 0 0 10px 0;">Mã OTP của bạn là:</p>
                            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px; text-align: center;">
                                ${otp}
                            </h1>
                        </div>
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>.
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 10px;">
                            Trân trọng,<br>
                            <strong>Đội ngũ Shoe Store</strong>
                        </p>
                    </div>
                </div>
            `;
        console.log('[Email] Using Resend API');
        return await sendViaResend(email, subject, html);
    } catch (error) {
        console.error('❌ Lỗi gửi email:', {
            code: error?.code,
            command: error?.command,
            message: error?.message,
            response: error?.response,
        });
        throw error;
    }
};

const sendPaymentSuccessEmail = async (email, orderData) => {
    try {
        const { orderId, totalAmount, items, createdAt, shippingAddress } = orderData;
        
        // Format currency
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        };

        // Format date
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const subject = 'Thanh toán thành công - Shoe Store';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #ff0000; margin: 0; font-size: 28px;">Shoe Store</h1>
                    </div>
                    
                    <div style="background-color: #fff; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="width: 60px; height: 60px; background-color: #48bb78; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 36px; font-weight: bold; transform: translateY(-3px);">✓</span>
                            </div>
                            <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px;">Thanh toán thành công!</h2>
                            <p style="color: #666; font-size: 16px; margin: 0;">Cảm ơn bạn đã mua sắm tại Shoe Store</p>
                        </div>
                    </div>

                    <div style="background-color: #fff; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Thông tin đơn hàng</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666; font-size: 14px;">Mã đơn hàng:</td>
                                <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600; text-align: right;">#${orderId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666; font-size: 14px;">Ngày đặt hàng:</td>
                                <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${formatDate(createdAt)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666; font-size: 14px;">Tổng tiền:</td>
                                <td style="padding: 8px 0; color: #ff0000; font-size: 18px; font-weight: 700; text-align: right;">${formatCurrency(totalAmount)}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="background-color: #fff; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Sản phẩm đã mua</h3>
                        ${items.map(item => `
                            <div style="padding: 15px 0; border-bottom: 1px solid #eee;">
                                <div style="display: flex; justify-content: space-between; align-items: start;">
                                    <div style="flex: 1;">
                                        <p style="color: #333; font-size: 15px; font-weight: 600; margin: 0 0 5px 0;">${item.name}</p>
                                        <p style="color: #666; font-size: 13px; margin: 0;">SKU: ${item.sku}</p>
                                        <p style="color: #666; font-size: 13px; margin: 5px 0 0 0;">Số lượng: ${item.quantity}</p>
                                    </div>
                                    <div style="text-align: right;">
                                        <p style="color: #333; font-size: 15px; font-weight: 600; margin: 0;">${formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    ${shippingAddress ? `
                    <div style="background-color: #fff; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Địa chỉ giao hàng</h3>
                        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
                            ${shippingAddress.fullAddress || ''}
                            ${shippingAddress.ward ? `, ${shippingAddress.ward}` : ''}
                            ${shippingAddress.district ? `, ${shippingAddress.district}` : ''}
                            ${shippingAddress.city ? `, ${shippingAddress.city}` : ''}
                        </p>
                    </div>
                    ` : ''}

                    <div style="background-color: #fff; padding: 25px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                        <p style="color: #666; font-size: 14px; margin: 0 0 15px 0;">Bạn có thể theo dõi đơn hàng của mình tại:</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile?tab=orders" 
                           style="display: inline-block; background-color: #ff0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">
                            Xem đơn hàng
                        </a>
                    </div>

                    <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center;">
                        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.<br>
                        Trân trọng,<br>
                        <strong>Đội ngũ Shoe Store</strong>
                    </p>
                </div>
            </div>
        `;
        
        console.log('[Email] Sending payment success email to:', email);
        return await sendViaResend(email, subject, html);
    } catch (error) {
        console.error('❌ Lỗi gửi email thông báo thanh toán:', {
            code: error?.code,
            message: error?.message,
            response: error?.response,
        });
        throw error;
    }
};

module.exports = {
    sendOTPEmail,
    sendPaymentSuccessEmail
};