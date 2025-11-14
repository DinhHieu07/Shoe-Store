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
    isLoaded: boolean;
    addItemToCart: (item: CartItem, quantity: number, size: string) => void;
    removeItemFromCart: (id: string, size: string) => void;
    updateItemQuantity: (id: string, newQuantity: number, size: string) => void;
    clearCart: () => void;
}

