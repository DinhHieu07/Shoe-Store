import { Variant } from "./product";

export interface CartItem {
    productId: string;
    price: number;
    quantity: number;
    image: string;
    name: string;
    discountPercent: number;
    discountPrice: number;
    basePrice: number;
    variant?: Variant;
    variantIndex?: number;
}

export interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    isLoaded: boolean;
    addItemToCart: (productId: string, quantity: number, price: number, variantIndex?: number) => Promise<void>;
    removeItemFromCart: (productId: string, size: string) => Promise<void>;
    updateItemQuantity: (productId: string, newQuantity: number, size: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

