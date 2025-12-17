export interface OrderItemPayload {
    productId: string;
    variantIndex?: number;
    name: string;
    sku: string;
    price: number;
    quantity: number;
}

export interface AddressPayload {
    label?: string;
    fullAddress: string;
    city?: string;
    district?: string;
    ward?: string;
    isDefault?: boolean;
}

export interface ProfilePayload {
    fullname: string;
    email: string;
    phone: string;
    avatar: string;
    role: 'admin' | 'customer';
    address: AddressPayload[];
}

export interface ShippingMethodPayload {
    name: string;
    method: 'fast' | 'standard' | 'freeship';
    fee: number;
    eta: string;
}

export interface PaymentPayload {
    method: 'ZALOPAY' | 'VNPAY' | 'MOMO';
    status?: 'pending' | 'success' | 'failed';
    transactionId?: string;
}

export interface CreateOrderPayload {
    items: OrderItemPayload[];
    shippingAddress: AddressPayload;
    voucherId?: string;
    voucherCode?: string;
    totalAmount: number;
    payment: PaymentPayload;
    shippingMethod: ShippingMethodPayload;
}

export type OrderStatus = 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';

export interface OrderItem {
    productId: string;
    variantIndex: number;
    name: string;
    sku: string;
    finalPrice: number;
    quantity: number;
    image?: string;
    size: string;
}

export interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    shippingStatus: OrderStatus;
    shippingAddress?: AddressPayload; // Thêm nếu cần hiển thị địa chỉ cho Admin
    payment?: PaymentPayload;         // Thêm nếu cần xem trạng thái thanh toán
    createdAt: string;
    customerName?: string;            // Admin cần biết đơn của ai
}