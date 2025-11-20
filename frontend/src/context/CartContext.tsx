'use client';
import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import {CartItem, CartContextType} from '@/types/cart';

//khoi tao Context voi gia tri mac dinh la undefined
export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ecom_cart';

export const CartProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // khoi tao mang rong
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try{
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            if(storedCart){
                setCartItems(JSON.parse(storedCart));
            }
        } catch (e){
            console.error('Lỗi khi tải giỏ hàng: ', e);
        } finally{
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if(!isLoaded) return;
        try{
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch(e){
            console.error('Lỗi khi lưu giỏ hàng: ', e);
        }
    }, [cartItems, isLoaded]);



    // them sp vao gio hang
    const addItemToCart = (newItem: CartItem, quantity: number=1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                i => i.id === newItem.id && i.size === newItem.size
            );

            // neu sp da ton tai: cap nhat sl
            if(existingItemIndex > -1){
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity
                };
                return updatedItems;
            } 
            // chua ton tai: them moi
            return [...prevItems, {...newItem, quantity: quantity}];
        });
    };

    // xoa sp
    const removeItemFromCart = (id: string, size: string) => {
        setCartItems(prevItems => prevItems.filter(i => !(i.id == id && i.size === size)));
    };

    // update sl
    const updateItemQuantity = (id: string, newQuantity: number, size: string) => {
        if(newQuantity <= 0){
            removeItemFromCart(id, size);
            return;
        }

        setCartItems(prevItems => prevItems.map(i => i.id === id && i.size === size ? {...i, quantity: newQuantity} : i));
    };

    // xoa gio hang
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem(CART_STORAGE_KEY);
    };

    // tong sp
    const cartCount = useMemo(() => cartItems.reduce((total, i) => total + i.quantity, 0), [cartItems]);

    const contextValue: CartContextType  & {isLoaded: boolean}= {
        cartItems,
        cartCount,
        isLoaded,
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