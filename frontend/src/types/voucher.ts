export interface VoucherPayload {
    _id: string;
    name: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed' | 'shipping';
    discountValue?: number;
    maxDiscount?: number;
    minOrderAmount: number;
    usageLimit?: number;
    usedCount?: number;
    startDate: string;
    expiryDate: string;
    isActive: boolean;
}