'use client';
import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import {CartItem, CartContextType} from '@/types/cart';

//khoi tao Context voi gia tri mac dinh la undefined
export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ecom_cart';

export const CartProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // khoi tao mang rong

    useEffect(() => {
        try{
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            if(storedCart){
                const parsedItem: CartItem[] = JSON.parse(storedCart);
                setCartItems(parsedItem);
            }
        } catch (e){
            console.error('Lỗi khi tải giỏ hàng: ', e);
            setCartItems([]);
        }
    }, []);

    useEffect(() => {
        try{
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch(e){
            console.error('Lỗi khi lưu giỏ hàng: ', e);
        }
    }, [cartItems]);

    // them sp vao gio hang
    const addItemToCart = (newItem: CartItem, quantity: number=1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === newItem.id
            );

            // neu sp da ton tai: cap nhat sl
            if(existingItemIndex > -1){
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity,
                };
                return updatedItems;
            } else{
                // chua ton tai: them moi
                return [...prevItems, {...newItem, quantity: quantity}];
            }
        });
    };

    // xoa sp
    const removeItemFromCart = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // update sl
    const updateItemQuantity = (id: string, newQuantity: number) => {
        if(newQuantity <= 0){
            removeItemFromCart(id);
            return;
        }

        setCartItems(prevItems => prevItems.map(item => item.id === id ? {...item, quantity: newQuantity} : item));
    };

    // xoa gio hang
    const clearCart = () => {
        setCartItems([]);
    }

    // tong sp
    const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

    const contextValue: CartContextType = {
        cartItems,
        cartCount,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
    };

    return (
        <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
    )
};

export const useCart = () : CartContextType => {
    const context = useContext(CartContext);
    if(context === undefined){
        throw new Error('useCart phải được sử dụng trong CartProvider');
    }
    return context;
};