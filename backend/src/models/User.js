const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    label: { type: String },
    fullAddress: { type: String, required: true },
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    isDefault: { type: Boolean, default: false },
})

const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    phone: { type: String },
    address: [AddressSchema],
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, index: true },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    refreshToken: { type: String, default: null },
})

UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ provider: 1 });

module.exports = mongoose.model('User', UserSchema);