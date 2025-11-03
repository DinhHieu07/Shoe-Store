require('dotenv').config();
const nodemailer = require('nodemailer');

// Tạo transporter để gửi email
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const secure = smtpPort === 465; // 465 cần TLS ngay từ đầu
const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure,
    auth: {
        user: process.env.SMTP_USER,
        // hỗ trợ cả SMTP_PASSWORD và SMTP_PASS để tránh sai tên biến môi trường
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS
    },
    pool: true,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
});

// Log cấu hình SMTP cơ bản và verify kết nối để chẩn đoán
try {
    console.log(`[SMTP] host=${smtpHost} port=${smtpPort} secure=${secure}`);
    transporter.verify()
        .then(() => console.log('[SMTP] verify: OK'))
        .catch((err) => console.error('[SMTP] verify: FAILED', err?.code || '', err?.message || err));
} catch (e) {
    console.error('[SMTP] verify: ERROR', e);
}

const sendViaResend = async (email, subject, html) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || 'Shoe Store <onboarding@resend.dev>';
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

        if (process.env.RESEND_API_KEY) {
            console.log('[Email] Using Resend API');
            return await sendViaResend(email, mailOptions.subject, mailOptions.html);
        }
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email đã được gửi:', info.messageId);
        return { success: true, messageId: info.messageId };
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

module.exports = {
    sendOTPEmail,
    transporter
};