'use client';
import React, {useState, useEffect, useMemo} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/ShoppingCart.module.css';
import DiscountCard from './DiscountCard';
import { FaTrashAlt } from 'react-icons/fa';
import { apiGetVouchers } from '@/services/apiVoucher';
import { VoucherPayload } from '@/types/voucher';
import {useCart} from '@/context/CartContext';

// dinh dang tien
const formatCurrency = (amount: number): string => {
    if (typeof amount !== 'number' || amount == 0) return '0₫';
    return amount.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'}); 
};

const ShoppingCart: React.FC = () => {
    const {cartItems, removeItemFromCart, updateItemQuantity, isLoaded, clearCart} = useCart();

    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]); 
    const [vouchers, setVouchers] = useState<VoucherPayload[]>([]); // luu voucher tu API
    const [toast, setToast] = useState<{
            message: string;
            type: 'success' | 'error' | 'warning' | 'info';
        } | null>(null);
    const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);

    useEffect(() => {
        if(cartItems.length > 0){
            setSelectedItemIds(cartItems.map(item => `${item.productId}-${item.variant?.size || ''}`));
        } else{
            setSelectedItemIds([]);
        }
    }, [cartItems]);

    useEffect(() => {
        const fetchVouchers = async () => {
            setIsLoadingVouchers(true);
            try{
                const res = await apiGetVouchers();
                if(res && res.success){
                    setVouchers(res.vouchers);
                } else{
                    setToast({message: res.message || 'Lỗi API', type: 'error'});
                }
            } catch(e){
                setToast({message: 'Lỗi kết nối khi tải voucher', type: 'error'});
            } finally{
                setIsLoadingVouchers(false);
            }
        };
        fetchVouchers();
    }, []);

    // tong tien
    const totalAmount = useMemo(() => {
        return cartItems
            .filter(item => selectedItemIds.includes(`${item.productId}-${item.variant?.size || ''}`))
            .reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [cartItems, selectedItemIds]);

    // xu ly SL
    const handleQuantityChange = (productId: string, size: string, delta: number) => {
        const item = cartItems.find(i => i.productId === productId && i.variant?.size === size);
        if(!item) return;

        const newQuantity = item.quantity + delta;
        if(newQuantity >= 1){
            updateItemQuantity(productId, newQuantity, size);
        } else {
            handleRemoveItem(productId, size);
        }
    };

    // checkbox tung sp
    const toggleItemSelection = (itemKey: string) => {
        setSelectedItemIds(prevIds => prevIds.includes(itemKey)
            ? prevIds.filter(k => k !== itemKey)
            : [...prevIds, itemKey]
        );
    };

    // checkbox chon tat ca
    const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

    const toggleSelectAll = () => {
        if(isAllSelected){
            setSelectedItemIds([]);
        } else{
            setSelectedItemIds(cartItems.map(item => `${item.productId}-${item.variant?.size || ''}`));
        }
    };

    const handleRemoveItem = (productId: string, size: string) => {
        removeItemFromCart(productId, size);
        const itemKey = `${productId}-${size}`;
        setSelectedItemIds(prev => prev.filter(k => k !== itemKey));
    }

    const isDisabled = selectedItemIds.length === 0;
    const selectedIdsString = selectedItemIds.join(',');

    return (
        <div className={styles.cartContainer}>
            <div className={styles.breadcrumb}>
                <Link href="/" className={styles.breadcrumbLink}>Trang chủ</Link> / 
                <span className={styles.current}> Giỏ hàng</span>
            </div>

            <div className={styles.mainContain}>
                <div className={styles.leftColumn}>
                    {/*khoi gio hang*/}
                    <div className={styles.cartItemsBlock}>
                        <div className={styles.cartTitle}>Giỏ hàng: </div>
                        {!isLoaded ? (
                            <p className={styles.emptyMessage}>Đang tải giỏ hàng...</p>
                        ) : cartItems.length === 0 ? (
                            <p className={styles.emptyMessage}>
                                Giỏ hàng của bạn đang trống. Mời bạn mua thêm sản phẩm <Link href="/" className={styles.emptyMessageLink}>tại đây.</Link>
                            </p>
                        ) : (
                            <>
                                <div className={styles.cartHeader}>
                                    <label htmlFor="checkboxAll">Chọn tất cả ({cartItems.length} sản phẩm)</label>
                                    <input 
                                        type="checkbox" 
                                        id="checkboxAll"
                                        checked={isAllSelected} 
                                        onChange={toggleSelectAll} 
                                        className={styles.checkboxAll}
                                    />
                                    <button className={styles.clearCartButton} onClick={() => clearCart()}>Xóa giỏ hàng</button>
                                </div>

                                <div className={styles.cartItemList}>
                                    {cartItems.map(item => {
                                        const key = `${item.productId}-${item.variant?.size}`;
                                        return(
                                            <div key={key} className={styles.cartItem}>
                                                <label htmlFor="itemCheckbox"></label>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedItemIds.includes(key)} 
                                                    onChange={() => toggleItemSelection(key)}
                                                    className={styles.itemCheckbox}
                                                    id="itemCheckbox"
                                                    title="Chọn sản phẩm"
                                                />
                                                <div className={styles.itemImageWrapper}>
                                                    <Image 
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={80}
                                                        height={80}
                                                        className={styles.itemImage}
                                                    />
                                                </div>
                                                <div className={styles.itemDetails}>
                                                    <div className={styles.itemName}>
                                                        <Link href={`/product/${item.variant?.sku}`}>{item.name}</Link>
                                                    </div>
                                                    <div className={styles.itemMeta}>
                                                        {item.variant?.size && <span>Size: {item.variant.size}</span>}
                                                    </div>
                                                    <div className={styles.itemPriceCurrent}>{formatCurrency(item.price)}</div>
                                                </div>
                                                <div className={styles.itemQuantityControl}>
                                                    <button onClick={() => handleQuantityChange(item.productId, item.variant?.size || '', -1)} title="Trừ 1">
                                                        -
                                                    </button>
                                                    <label htmlFor="quantity"></label>
                                                    <input type="text" value={item.quantity} readOnly title="Số lượng" id="quantity" />
                                                    <button onClick={() => handleQuantityChange(item.productId, item.variant?.size || '', 1)} title="Thêm 1">
                                                        +
                                                    </button>
                                                </div>
                                                <div className={styles.itemSubTotal}>
                                                    {formatCurrency(item.price * item.quantity)}
                                                </div>
                                                <button className={styles.itemRemoveButton} onClick={() => handleRemoveItem(item.productId, item.variant?.size || '')} title="Xóa sản phẩm">
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        )
                                        
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/*Khoi voucher*/}
                    <div className={styles.voucherBlock}>
                        <h3>MÃ GIẢM GIÁ</h3>
                        <div className={styles.discountCardWrapper}>
                            {isLoadingVouchers ? (
                                <p style={{ fontSize: '14px', color: '#666' }}>Đang tải mã giảm giá...</p>
                            ) : vouchers.length > 0 ? (
                                vouchers.map(v => <DiscountCard key={v.code} voucher={v} />)
                            ) : (
                                <p style={{ fontSize: '14px', color: '#666' }}>Không có mã giảm giá khả dụng.</p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Thông tin đơn hàng*/}
                <div className={styles.rightColumn}>
                    <h2>Thông tin đơn hàng</h2>

                    <div className={styles.orderSummary}>
                        <p>Tổng tiền tạm tính: </p>
                        <span className={styles.totalAmount}>{formatCurrency(totalAmount)}</span>
                    </div>
                            
                    <Link
                        href={isDisabled ? "#" : `/checkout?selectedIds=${selectedIdsString}`}
                        className={`${styles.checkoutButton} ${isDisabled ? styles.disabled : ""}`}
                        aria-disabled={isDisabled}
                    >
                        THANH TOÁN
                    </Link>

                    <Link href="/" className={styles.continueShopping}>↩ Tiếp tục mua hàng</Link>
                </div>
            </div>
           
        </div>
    );
};
export default ShoppingCart;