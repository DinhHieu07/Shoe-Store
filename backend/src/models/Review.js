const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true }); // 1 user chỉ review 1 lần
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ productId: 1, rating: 1 }); // Compound index cho filter theo rating

module.exports = mongoose.model('Review', ReviewSchema);