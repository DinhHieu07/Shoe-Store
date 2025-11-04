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

module.exports = {
    sendOTPEmail
};