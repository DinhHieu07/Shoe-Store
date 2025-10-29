const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Vui lòng đăng nhập để tiếp tục" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token đã hết hạn, vui lòng đăng nhập lại" });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Token không hợp lệ" });
        }
        
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
}

module.exports = authMiddleware;