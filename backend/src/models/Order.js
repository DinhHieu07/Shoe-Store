const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    label: { type: String },
    fullAddress: { type: String, required: true },
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    isDefault: { type: Boolean, default: false },
});

const OrderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variantIndex: { type: Number },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const PaymentSchema = new mongoose.Schema({
    method: { type: String, enum: ['ZALOPAY', 'VNPAY', 'MOMO'], default: 'ZALOPAY' },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    transactionId: { type: String }
});

const ShippingMethodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    method: { type: String, enum: ['fast', 'standard'], default: 'standard' },
    fee: { type: Number, required: true },
    eta: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    items: [OrderItemSchema],
    shippingAddress: AddressSchema,
    voucherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' },
    voucherCode: { type: String },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded', 'return_requested'], default: 'pending' },
    payment: PaymentSchema,
    shippingMethod: ShippingMethodSchema,
    createdAt: { type: Date, default: Date.now }
});

OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ userId: 1, status: 1 }); // Compound index
OrderSchema.index({ voucherId: 1 });
OrderSchema.index({ totalAmount: 1 });
OrderSchema.index({ 'payment.status': 1 }); // Index cho payment status

module.exports = mongoose.model('Order', OrderSchema);