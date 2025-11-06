const Voucher = require('../models/Voucher');
const Category = require('../models/Category');

const getVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'applicableCategories', select: 'name' })
            .lean();
        return res.status(200).json({ success: true, vouchers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách voucher' });
    }
};

const addVoucher = async (req, res) => {
    try {
        const {
            name,
            code,
            description,
            discountType,
            discountValue,
            maxDiscount,
            minOrderAmount,
            usageLimit,
            startDate,
            expiryDate,
            isActive,
            applicableCategories = [],
            applicableProducts = [],
            applicableUsers = []
        } = req.body;

        if (!name || !code || !expiryDate) {
            return res.status(400).json({ success: false, message: 'Thiếu trường bắt buộc' });
        }
        // discountValue chỉ bắt buộc khi không phải loại shipping
        if (discountType !== 'shipping' && !discountValue) {
            return res.status(400).json({ success: false, message: 'Giá trị voucher là bắt buộc' });
        }

        const exists = await Voucher.findOne({ code });
        if (exists) return res.status(409).json({ success: false, message: 'Mã voucher đã tồn tại' });

        const voucher = await Voucher.create({
            name,
            code: code.trim().toUpperCase(),
            description,
            discountType,
            discountValue,
            maxDiscount,
            minOrderAmount,
            usageLimit,
            startDate,
            expiryDate,
            isActive,
            applicableCategories,
            applicableProducts,
            applicableUsers
        });

        return res.status(201).json({ success: true, message: 'Tạo voucher thành công', voucher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi tạo voucher' });
    }
};

const editVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const update = { ...req.body, updatedAt: Date.now() };
        if (update.code) update.code = update.code.trim().toUpperCase();
        const voucher = await Voucher.findByIdAndUpdate(id, update, { new: true });
        if (!voucher) return res.status(404).json({ success: false, message: 'Không tìm thấy voucher' });
        return res.status(200).json({ success: true, message: 'Cập nhật voucher thành công', voucher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật voucher' });
    }
};

const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const voucher = await Voucher.findByIdAndDelete(id);
        if (!voucher) return res.status(404).json({ success: false, message: 'Không tìm thấy voucher' });
        return res.status(200).json({ success: true, message: 'Xóa voucher thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi xóa voucher' });
    }
};

// Validate áp dụng voucher theo tổng tiền, ngày hiệu lực và giới hạn dùng
const validateVoucher = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        const now = new Date();
        const voucher = await Voucher.findOne({ code: (code || '').trim().toUpperCase() });
        if (!voucher) return res.status(404).json({ success: false, message: 'Mã không tồn tại' });
        if (!voucher.isActive) return res.status(400).json({ success: false, message: 'Voucher đang tạm khóa' });
        if (now < voucher.startDate) return res.status(400).json({ success: false, message: 'Voucher chưa bắt đầu' });
        if (now > voucher.expiryDate) return res.status(400).json({ success: false, message: 'Voucher đã hết hạn' });
        if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
            return res.status(400).json({ success: false, message: 'Voucher đã hết lượt dùng' });
        }
        if (voucher.minOrderAmount && Number(orderAmount) < voucher.minOrderAmount) {
            return res.status(400).json({ success: false, message: 'Chưa đạt giá trị đơn tối thiểu' });
        }

        let discount = 0;
        if (voucher.discountType === 'fixed') {
            discount = voucher.discountValue || 0;
        } else if (voucher.discountType === 'shipping') {
            discount = 0;
        } else {
            discount = Math.floor((Number(orderAmount) * (voucher.discountValue || 0)) / 100);
            if (voucher.maxDiscount) discount = Math.min(discount, voucher.maxDiscount);
        }

        return res.status(200).json({ success: true, discount, voucher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi kiểm tra voucher' });
    }
};

module.exports = {
    getVouchers,
    addVoucher,
    editVoucher,
    deleteVoucher,
    validateVoucher,
};


