const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: "Vui lòng đăng nhập để tiếp tục" });
            }

            const userRole = req.user.role;
            
            if (!allowedRoles || allowedRoles.length === 0) {
                return next();
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ 
                    success: false, 
                    message: "Bạn không có quyền truy cập chức năng này" 
                });
            }

            next();
        } catch (error) {
            console.error('Role middleware error:', error);
            res.status(500).json({ success: false, message: "Lỗi server" });
        }
    };
};

module.exports = roleMiddleware;
