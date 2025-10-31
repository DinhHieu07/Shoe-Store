export interface Variant {
    sku: string;
    size: string;
    color: string;
    price: string;
    stock: string;
}

export interface DetailDescription {
    material: string;
    origin: string;
    status: string;
    commitment: string;
    note: string;
}

export interface Category {
    _id: string;
    name: string;
}

export interface DiscountCode {
    _id: string;
    name: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscount?: number;
    minOrderAmount: number;
    expiryDate?: Date | string;
}

export interface ProductDetailData {
    _id: string;
    name: string;
    brand: string;
    basePrice: string;
    images: string[];
    category: string;
    categoryIds: Category[];
    description: DetailDescription;
    variants: Variant[];
    discountCodes: DiscountCode[];
    policies: {
        iconType: 'box' | 'exchange' | 'truck';
        description: string;
    }[];
}

export interface RelatedProduct {
    _id: string;
    name: string;
    sku: string;
    basePrice: string;
    tag?: string;
    imageUrl: string;
}