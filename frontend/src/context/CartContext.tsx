'use client';
import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { CartItem, CartContextType } from '@/types/cart';
import { apiGetCart, apiAddToCart, apiUpdateItemQuantity, apiDeleteItemFromCart, apiDeleteAllItemsFromCart } from '@/services/apiCart';
import Toast from '@/components/Toast';

//khoi tao Context voi gia tri mac dinh la undefined
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // khoi tao mang rong
    const [isLoaded, setIsLoaded] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);
    // Lưu timeout ID cho debounce của từng item (key: productId-size)
    const debounceTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
    
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await apiGetCart();
                if (data.success) {
                    setCartItems(data.items || []);
                }
            } catch (e) {
                console.error('Lỗi khi tải giỏ hàng: ', e);
            } finally {
                setIsLoaded(true);
            }
        };
        fetchCart();
    }, []);

    // Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            debounceTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
            debounceTimeoutsRef.current.clear();
        };
    }, []);

    // them sp vao gio hang
    const addItemToCart = async (productId: string, quantity: number = 1, price: number, variantIndex?: number) => {
        try {
            const data = await apiAddToCart(productId, quantity, price, variantIndex);
            if (data.success && data.item) {
                setCartItems(prev => {
                    if (data.isUpdate) {
                        // Update item đã tồn tại
                        return prev.map(item => 
                            item.productId === data.item.productId && 
                            item.variant?.size === data.item.variant?.size
                                ? data.item
                                : item
                        );
                    }
                    // Thêm item mới
                    return [data.item, ...prev];
                });
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
        }
    };

    // xoa sp
    const removeItemFromCart = async (productId: string, size: string) => {
        try {
            const data = await apiDeleteItemFromCart(productId, size);
            if (data.success) {
                setCartItems(prev => prev.filter(item => 
                    item.productId !== productId || item.variant?.size !== size
                ));
                setToast({message: data.message || 'Đã xóa sản phẩm khỏi giỏ hàng', type: 'success'});
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
        }
    };

    // update sl
    const updateItemQuantity = async (productId: string, newQuantity: number, size: string) => {
        // Nếu số lượng <= 0, xóa ngay lập tức (không debounce)
        if (newQuantity <= 0) {
            // Clear timeout nếu có
            const key = `${productId}-${size}`;
            const existingTimeout = debounceTimeoutsRef.current.get(key);
            if (existingTimeout) {
                clearTimeout(existingTimeout);
                debounceTimeoutsRef.current.delete(key);
            }
            await removeItemFromCart(productId, size);
            return;
        }

        setCartItems(prev => prev.map(item => 
            item.productId === productId && item.variant?.size === size 
                ? { ...item, quantity: newQuantity } 
                : item
        ));

        // Tạo key để lưu timeout cho từng item
        const key = `${productId}-${size}`;
        
        // Clear timeout cũ nếu có
        const existingTimeout = debounceTimeoutsRef.current.get(key);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        // Tạo timeout mới để gọi API sau 500ms
        const timeoutId = setTimeout(async () => {
            try {
                const data = await apiUpdateItemQuantity(productId, newQuantity, size);
                if (data.success) {
                    setCartItems(prev => prev.map(item => 
                        item.productId === productId && item.variant?.size === size 
                            ? { ...item, quantity: newQuantity } 
                            : item
                    ));
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật số lượng:', error);
            } finally {
                // Xóa timeout khỏi map sau khi hoàn thành
                debounceTimeoutsRef.current.delete(key);
            }
        }, 500); // Đợi 500ms sau khi người dùng ngừng tương tác

        // Lưu timeout ID vào map
        debounceTimeoutsRef.current.set(key, timeoutId);
    };

    // xoa gio hang
    const clearCart = async () => {
        try {
            const data = await apiDeleteAllItemsFromCart();
            if (data.success) {
                setCartItems([]);
                setToast({message: data.message || 'Đã xóa giỏ hàng', type: 'success'});
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error);
        }
    };

    // refresh cart từ server
    const refreshCart = async () => {
        try {
            const data = await apiGetCart();
            if (data.success) {
                setCartItems(data.items || []);
            }
        } catch (e) {
            console.error('Lỗi khi refresh giỏ hàng: ', e);
        }
    };

    // tong sp
    const cartCount = useMemo(() => cartItems.reduce((total, i) => total + i.quantity, 0), [cartItems]);

    const contextValue: CartContextType & { isLoaded: boolean } = {
        cartItems,
        cartCount,
        isLoaded,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        refreshCart,
    };

    return (
        <CartContext.Provider value={contextValue}>{children}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </CartContext.Provider>
    )
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart phải được sử dụng trong CartProvider');
    }
    return context;
};