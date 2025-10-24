const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
    sku: { type: String, index: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 }
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String },
    brand: { type: String, required: true },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    basePrice: { type: Number, required: true },
    variants: [VariantSchema],
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ProductSchema.index({ brand: 1 });
ProductSchema.index({ categoryIds: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ basePrice: 1 });
ProductSchema.index({ totalReviews: -1 });
ProductSchema.index({ name: 'text', description: 'text' }); // Text search

module.exports = mongoose.model('Product', ProductSchema);