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
    const {cartItems, removeItemFromCart, updateItemQuantity, isLoaded} = useCart();

    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]); 
    const [vouchers, setVouchers] = useState<VoucherPayload[]>([]); // luu voucher tu API
    const [toast, setToast] = useState<{
            message: string;
            type: 'success' | 'error' | 'warning' | 'info';
        } | null>(null);
    const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);

    useEffect(() => {
        if(cartItems.length > 0){
            setSelectedItemIds(cartItems.map(item => `${item.id}_${item.size!}`));
        } else{
            setSelectedItemIds([]);
        }
    }, [cartItems]);

    useEffect(() => {
        const fetchVouchers = async () => {
            setIsLoadingVouchers(true);
            try{
                const res = await apiGetVouchers();
                console.log('Voucher API response:', res);
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
            .filter(item => selectedItemIds.includes( `${item.id}_${item.size!}`))
            .reduce((acc, item) => acc + (item.basePrice * item.quantity), 0);
    }, [cartItems, selectedItemIds]);

    // xu ly SL
    const handleQuantityChange = (id : string, size: string, delta: number) => {
        const item = cartItems.find(i => i.id === id && i.size === size);
        if(!item) return;

        const newQuantity = item.quantity + delta;
        if(newQuantity >= 1){
            updateItemQuantity(id, newQuantity, size);
        } else {
            handleRemoveItem(id, size);
        }
    };

    // checkbox tung sp
    const toggleItemSelection = (id: string, size: string) => {
        const key = `${id}_${size}`;
        setSelectedItemIds(prevIds => prevIds.includes(key)
            ? prevIds.filter(k => k !== key)
            : [...prevIds, key]
        );
    };

    // checkbox chon tat ca
    const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

    const toggleSelectAll = () => {
        if(isAllSelected){
            setSelectedItemIds([]);
        } else{
            setSelectedItemIds(cartItems.map(item => `${item.id}_${item.size!}`));
        }
    };

    const handleRemoveItem = (id: string, size: string) => {
        removeItemFromCart(id, size);
        setSelectedItemIds(prev => prev.filter(k => k !== `${id}_${size}`));
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
                                    <input 
                                        type="checkbox" 
                                        checked={isAllSelected} 
                                        onChange={toggleSelectAll} 
                                        className={styles.checkboxAll} 
                                    />
                                    <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
                                </div>

                                <div className={styles.cartItemList}>
                                    {cartItems.map(item => {
                                        const key = `${item.id}_${item.size!}`;
                                        return(
                                            <div key={key} className={styles.cartItem}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedItemIds.includes(key)} 
                                                    onChange={() => toggleItemSelection(item.id, item.size!)}
                                                    className={styles.itemCheckbox}
                                                />
                                                <div className={styles.itemImageWrapper}>
                                                    <Image 
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        width={80}
                                                        height={80}
                                                        className={styles.itemImage}
                                                    />
                                                </div>
                                                <div className={styles.itemDetails}>
                                                    <div className={styles.itemName}>
                                                        <Link href={`/product/${item.id}`}>{item.name}</Link>
                                                    </div>
                                                    <div className={styles.itemMeta}>
                                                        {item.size && <span>Size: {item.size}</span>}
                                                    </div>
                                                    <div className={styles.itemPriceCurrent}>{formatCurrency(item.basePrice)}</div>
                                                </div>
                                                <div className={styles.itemQuantityControl}>
                                                    <button onClick={() => handleQuantityChange(item.id, item.size!, -1)}>-</button>
                                                    <input type="text" value={item.quantity} readOnly />
                                                    <button onClick={() => handleQuantityChange(item.id, item.size!, 1)}>+</button>
                                                </div>
                                                <div className={styles.itemSubTotal}>
                                                    {formatCurrency(item.basePrice * item.quantity)}
                                                </div>
                                                <button className={styles.itemRemoveButton} onClick={() => handleRemoveItem(item.id, item.size!)} title="Xóa sản phẩm">
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

                    <div className={styles.inputGroup}>
                        <label htmlFor="ghiChu">Ghi chú đơn hàng</label>
                        <textarea id="ghiChu" placeholder="Ghi chú..."  rows={3}  className={styles.textareaInput}/>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="maKhuyenMai">Nhập mã khuyễn mãi</label>
                        <input type="text" id="maKhuyenMai" placeholder="Nhập mã khuyến mãi" />
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