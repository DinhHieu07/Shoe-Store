const User = require('../models/User');
const { clientRedis } = require('../config/redis');
const { sendOTPEmail } = require('../config/email');
const bcrypt = require('bcrypt');

const APP_ID = process.env.APP_ID;

const validateEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email không tồn tại" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const key = `${APP_ID}:otp:${email}`;
        await clientRedis.set(key, otp, { EX: 60 * 5 });
        await sendOTPEmail(email, otp);
        
        return res.status(200).json({ 
            success: true, 
            message: "Mã OTP đã được gửi đến email của bạn" 
        });
    }
    catch (error) {
        console.error('Lỗi trong validateEmail:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau." 
        });
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const key = `${APP_ID}:otp:${email}`;
        const storedOTP = await clientRedis.get(key);
        if (!storedOTP) {
            return res.status(400).json({ success: false, message: "Mã OTP đã hết hạn" });
        }
        if (storedOTP !== otp) {
            return res.status(400).json({ success: false, message: "Mã OTP không đúng" });
        }
        return res.status(200).json({ success: true, message: "Mã OTP đúng" });
    }
    catch (error) {
        console.error('Lỗi trong verifyOTP:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau." 
        });
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email không tồn tại" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ success: true, message: "Mật khẩu đã được đặt lại" });
    }
    catch (error) {
        console.error('Lỗi trong changePassword:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau." 
        });
    }
}

module.exports = { validateEmail, verifyOTP, changePassword };