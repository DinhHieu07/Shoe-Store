'use client';
import React, {useState, useMemo, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useCart} from '@/context/CartContext';
import styles from '@/styles/Checkout.module.css';
import {apiGetVouchers} from '@/services/apiVoucher';
import {VoucherPayload} from '@/types/voucher';
import SelectedItemsFetcher from './SelectedItemsFetcher';
import {CartItem} from '@/types/cart';

interface ShippingMethod {
    id: string;
    name: string;
    fee: number;
    eta?: string;
}

const formatCurrency = (amount: number): string => {
    if(typeof amount !== 'number' || isNaN(amount)) return '0₫';
    return amount.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
};

const CheckoutContent: React.FC<{selectedItems: CartItem[]}> = ({selectedItems}) => {
    const {removeItemFromCart} = useCart();

    // address modal
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    // state quan ly voucher
    const [vouchers, setVouchers] = useState<VoucherPayload[]>([]);
    const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);
    const [voucherPopup, setVoucherPopup] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherPayload | null>(null);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);

    //phi ship
    const [shippingPopup, setShippingPopup] = useState(false);
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod[]>([
        { id: 'fast', name: 'Giao nhanh (1-2 ngày)', fee: 30000, eta: '1-2 ngày' },
        { id: 'standard', name: 'Tiết kiệm (3-5 ngày)', fee: 20000, eta: '3-5 ngày' },
        { id: 'freeship', name: 'Miễn phí (điều kiện)', fee: 0, eta: '3-7 ngày' },
    ]);

    const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null);

    useEffect(() => {
        if(toast) {
            const timer = setTimeout(() => setToast(null), 3000); // tu dong an toast sau 3s
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        const fetchVouchers = async () => {
            setIsLoadingVouchers(true);
            try{
                const res = await apiGetVouchers();
                console.log('Voucher API response: ', res);
                if(res && res.success){
                    setVouchers(res.vouchers);
                } else{
                    setToast({message: res.message || 'Lỗi API voucher', type: 'error'});
                }
            } catch(e){
                setToast({message: 'Lỗi kết nối khi tải voucher', type:'error'});
            } finally{
                setIsLoadingVouchers(false);
            }
        };
        fetchVouchers()
    }, []); 

     //tong tien
    const subtotal = useMemo(() => {
        return selectedItems.reduce((acc, item) => acc + (item.basePrice * item.quantity), 0);
    }, [selectedItems]);

    // giam gia voucher
    const discount = selectedVoucher ? (selectedVoucher.discountValue ?? 0) : 0;

    // phi ship
    const shippingFee = selectedShipping ? selectedShipping.fee : 0;

    // tong thanh toan
    const total = Math.max(subtotal + shippingFee - discount, 0);

        const handleSelectVoucher = (v: VoucherPayload) => {
        setSelectedVoucher(v);
        setVoucherPopup(false);
        setToast({message: `Áp dụng voucher ${v.code}`, type:'success'});
    };

    const handleRemoveVoucher = () => {
        setSelectedVoucher(null);
        setToast({message: 'Đã hủy voucher', type:'info'});
    }

    const handleSelectShipping = (m: ShippingMethod) => {
        setSelectedShipping(m);
        setShippingPopup(false);
        setToast({message: `Chọn vận chuyển: ${m.name}`, type: 'info'});
    };

    const handleAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const name = (form.elements.namedItem('fullname') as HTMLInputElement).value.trim();
        const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
        const addr = (form.elements.namedItem('address') as HTMLInputElement).value.trim();
        if(!name || !phone || !addr){
            setToast({message: 'Vui lòng điền đầy đủ thông tin địa chỉ!', type: 'warning'});
            return;
        }
        setAddress(`${name} • ${phone} • ${addr}`);
        setShowAddressForm(false);
        setToast({message: 'Đã lưu địa chỉ', type: 'success'});
    };

    const handlePlaceOrder = () => {
        if (selectedItems.length === 0) {
        setToast({ message: 'Giỏ hàng trống', type: 'warning' });
        return;
        }
        if (!address) {
        setToast({ message: 'Vui lòng thêm địa chỉ nhận hàng', type: 'warning' });
        return;
        }
        if (!selectedShipping) {
            setToast({ message: 'Vui lòng chọn phương thức vận chuyển', type: 'warning' });
            return;
        }
        setToast({ message: 'Đặt hàng thành công!', type: 'success' });
        
    };

    return (
        <div className={styles.checkoutContainer}>
            <div className={styles.wrapper}>
                <div className={styles.breadcrumb}>
                    <Link href="/">Trang chủ </Link> / <Link href="/shoppingcart"> Giỏ hàng </Link> /
                    <span>Thanh toán</span>
                </div>

                <div className={`${styles.card} ${styles.addressCard}`}>
                    <div className={styles.addressHeader}>
                        <h3 className={styles.addressTitle}>📍Địa Chỉ Nhận Hàng</h3>
                        <button className={styles.btnPrimary} onClick={() => setShowAddressForm(true)}>
                            {address ? 'Chỉnh sửa' : 'Thêm'}
                        </button>
                    </div>

                    {address ? (
                        <p className={styles.addressDetail}>{address}</p>
                    ) : (
                        <p className={styles.emptyText}>Chưa có địa chỉ nhận hàng.</p>
                    )}
                </div>

                <div className={styles.card}>
                    <div className={styles.productSectionHeader}>
                        <h3 className={styles.sectionTitle}>Sản phẩm</h3>
                        <div className={styles.productHeaderRow}>
                            <div>Đơn giá</div>
                            <div>Số lượng</div>
                            <div>Thành tiền</div>
                        </div>
                    </div>
                    
                    <div className={styles.productList}>
                        {selectedItems.length === 0 ? (
                            <p className={styles.emptyText}>Giỏ hàng của bạn đang trống</p>
                        ) : (
                            selectedItems.map((item) => (
                                <div className={styles.productRow} key={`${item.id}_${item.size ?? ''}`}>
                                    <div className={styles.productLeft}>
                                        <Image src={item.imageUrl} alt={item.name} width={60} height={60} className={styles.thumb} />
                                        <div>
                                            <div className={styles.productName}>{item.name}</div>
                                            {item.size && <div className={styles.productMeta}>Size: {item.size}</div>}
                                        </div>
                                    </div>
                                    <div className={styles.productRight}>
                                        <div className={styles.price}>{formatCurrency(item.basePrice)}</div>
                                        <div className={styles.qty}>{item.quantity}</div>
                                        <div className={styles.lineTotal}>{formatCurrency(item.basePrice * item.quantity)}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>🎫 Voucher / Mã giảm giá</h3>
                        {selectedVoucher ? (
                            <button className={`${styles.linkBtn} ${styles.removeVoucherBtn}`} onClick={handleRemoveVoucher}>
                                Bỏ chọn
                            </button>
                        ) : (
                            <button className={styles.linkBtn} onClick={() => setVoucherPopup(true)}>Chọn voucher</button>
                        )}
                    </div>

                    <div className={styles.block}>
                        {selectedVoucher ? (
                            <div className={styles.appliedVoucher}>
                                <strong>{selectedVoucher.code}</strong> (Giảm: {formatCurrency(discount)})
                            </div>
                        ) : (
                            <div className={styles.emptyText}>Chưa chọn voucher</div>
                        )}
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Phương thức vận chuyển</h3>
                        <button className={styles.linkBtn} onClick={() => setShippingPopup(true)}>
                            {selectedShipping ? 'Thay đổi' : 'Chọn phương thức'}
                        </button>
                    </div>
                    <div className={styles.block}>
                        {selectedShipping ? (
                            <div className={styles.appliedVoucher}>
                                <strong>{selectedShipping?.name}</strong> (Phí: {formatCurrency(selectedShipping?.fee ?? 0)})
                            </div>
                        ) : (
                            <div className={styles.emptyText}>Chưa chọn phương thức vận chuyển</div>
                        )} 
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>Phương thức thanh toán</h3>
                    <div className={styles.paymentMethod}>Thanh toán khi nhận hàng (COD)</div>
                </div>

                <div className={`${styles.card} ${styles.summaryCard}`}>
                    <div className={styles.summaryRow}>
                        <span>Tổng tiền hàng</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>

                    <div className={styles.summaryRow}>
                        <span>Phí vận chuyển</span>
                        <span>{formatCurrency(shippingFee)}</span>
                    </div>

                    <div className={styles.summaryRow}>
                        <span>Giảm giá (voucher)</span>
                        <span className={styles.discountText}>-{formatCurrency(discount)}</span>
                    </div>

                    <div className={styles.summaryTotal}>
                        <strong>Tổng thanh toán</strong>
                        <strong className={styles.totalPrice}>{formatCurrency(total)}</strong>
                    </div>

                    <div className={styles.placeOrderWrapper}>
                        <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>
                            ĐẶT HÀNG
                        </button>
                    </div>
                </div>
            </div>

            {showAddressForm && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h3>Địa chỉ nhận hàng</h3>
                        <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
                            <input name="fullname" placeholder="Họ tên" defaultValue={address ? address.split(' • ')[0] : ''} />
                            <input name="phone" placeholder="Số điện thoại" defaultValue={address ? (address.split(' • ')[1] ?? '') : ''} />
                            <input name="address" placeholder="Địa chỉ" defaultValue={address ? (address.split(' • ')[2] ?? '') : ''} />
                            <div className={styles.popupActions}>
                                <button type="button" onClick={() => setShowAddressForm(false)} className={styles.cancelBtn}>Hủy</button>
                                <button type="submit" className={styles.btnPrimary}>Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}    

            {voucherPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupScroll}>
                        <h3>Chọn voucher</h3>
                        <div className={styles.scrollList}>
                        {isLoadingVouchers ? (
                            <p>Đang tải mã giảm giá...</p>
                        ) : vouchers.length > 0 ? (
                            vouchers.map((v) => (
                            <div
                                key={v.code}
                                className={styles.voucherItem}
                                onClick={() => handleSelectVoucher(v)}
                            >
                                <div className={styles.voucherLeft}>
                                    <strong>{v.code}</strong>
                                    <div className={styles.voucherMeta}>{v.name ?? ''}</div>
                                </div>
                                <div className={styles.voucherRight}>-{formatCurrency(v.discountValue ?? 0)}</div>
                            </div>
                            ))
                        ) : (
                            <p>Không có mã giảm giá khả dụng.</p>
                        )}
                        </div>
                        <div className={styles.popupActions}>
                            <button onClick={() => setVoucherPopup(false)} className={styles.cancelBtn}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {shippingPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupScroll}>
                        <h3>Chọn phương thức vận chuyển</h3>
                        <div className={styles.scrollList}>
                            {shippingMethod.map((m) => (
                                <div key={m.id} className={styles.voucherItem} onClick={() => handleSelectShipping(m)}>
                                <div className={styles.voucherLeft}>
                                    <strong>{m.name}</strong>
                                    <div className={styles.voucherMeta}>{m.eta}</div>
                                </div>
                                <div className={styles.voucherRight}>{formatCurrency(m.fee)}</div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.popupActions}>
                            <button onClick={() => setShippingPopup(false)} className={styles.cancelBtn}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`${styles.toast} ${styles[toast.type] ?? ''}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

const Checkout: React.FC = () => {
    const {cartItems} = useCart();
    return (
        <SelectedItemsFetcher cartItems={cartItems}>
            {(selectedItems: CartItem[]) => <CheckoutContent selectedItems={selectedItems} />}
        </SelectedItemsFetcher>
    );
};

export default Checkout;

