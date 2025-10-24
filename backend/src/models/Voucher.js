const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, required: true, min: 0 }, // % hoặc số tiền
    maxDiscount: { type: Number }, // Giảm giá tối đa (cho percentage)
    
    minOrderAmount: { type: Number, default: 0 }, // Đơn hàng tối thiểu
    usageLimit: { type: Number }, // Số lần sử dụng tối đa
    usedCount: { type: Number, default: 0 }, // Số lần đã sử dụng
    
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    applicableUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

VoucherSchema.index({ isActive: 1 });
VoucherSchema.index({ expiryDate: 1 });
VoucherSchema.index({ startDate: 1, expiryDate: 1 }); // Range query
VoucherSchema.index({ applicableCategories: 1 });
VoucherSchema.index({ discountType: 1 });
VoucherSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Voucher', VoucherSchema);