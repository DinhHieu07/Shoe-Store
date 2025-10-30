require('dotenv').config();
const nodemailer = require('nodemailer');

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true cho port 465, false cho các port khác
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"Shoe Store" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Mã OTP đặt lại mật khẩu',
            html: `
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
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email đã được gửi:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Lỗi gửi email:', error);
        throw error;
    }
};

module.exports = {
    sendOTPEmail,
    transporter
};