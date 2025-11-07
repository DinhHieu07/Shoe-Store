export interface CartItem {
    id: string;
    name: string;
    basePrice: number;
    quantity: number;
    imageUrl: string;
    size?: string;
}

export interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    addItemToCart: (item: CartItem, quantity: number) => void;
    removeItemFromCart: (id: string) => void;
    updateItemQuantity: (id: string, newQuantity: number) => void;
    clearCart: () => void;
}

