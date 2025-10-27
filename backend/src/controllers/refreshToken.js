const jwt = require("jsonwebtoken");
const User = require("../models/User");

const refreshToken = async (req, res) => {
    try {
        console.log("refreshToken");
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Không tìm thấy refresh token" });
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Người dùng không tồn tại" });
        }
        // Đối chiếu refresh token trong DB để tránh dùng token cũ/đã thu hồi
        if (!user.refreshToken || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token không hợp lệ" });
        }
        const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });
        res.status(200).json({ success: true, message: "Token đã được cập nhật" });
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Refresh token đã hết hạn" });
        }
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
}

module.exports = { refreshToken };