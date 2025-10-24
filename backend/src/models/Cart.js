const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variantIndex: { type: Number },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }
});

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    items: [CartItemSchema],
    createdAt: { type: Date, default: Date.now }
});

CartSchema.index({ userId: 1 });
CartSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Cart', CartSchema);