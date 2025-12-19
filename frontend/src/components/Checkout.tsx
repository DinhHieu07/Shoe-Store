'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from '@/styles/Checkout.module.css';
import { apiGetVouchers, apiValidateVoucher } from '@/services/apiVoucher';
import { VoucherPayload } from '@/types/voucher';
import SelectedItemsFetcher from './SelectedItemsFetcher';
import { CartItem } from '@/types/cart';
import { apiCreateOrder, apiCreateZaloPayPaymentUrl } from '@/services/apiOrder';
import { AddressPayload, ShippingMethodPayload, PaymentPayload, ProfilePayload,  } from '@/types/order';
import { apiGetProfile } from '@/services/apiProfile';
import { apiUpdateAddress } from '@/services/apiAddress';

const formatCurrency = (amount: number): string => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0₫';
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const CheckoutContent: React.FC<{ selectedItems: CartItem[] }> = ({ selectedItems }) => {
    const { removeItemFromCart } = useCart();
    const router = useRouter();

    const [profile, setProfile] = useState<ProfilePayload | null>(null);

    // address modal
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showAddressList, setShowAddressList] = useState(false);
    const [address, setAddress] = useState<AddressPayload | null>(null);
    const [addressDisplay, setAddressDisplay] = useState<string>('');
    const [savedAddresses, setSavedAddresses] = useState<AddressPayload[]>([]);

    // state quan ly voucher
    const [vouchers, setVouchers] = useState<VoucherPayload[]>([]);
    const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);
    const [voucherPopup, setVoucherPopup] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherPayload | null>(null);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    //phi ship
    const [shippingPopup, setShippingPopup] = useState(false);
    const [shippingMethod, setShippingMethod] = useState<ShippingMethodPayload[]>([
        { method: 'fast', name: 'Giao nhanh (1-2 ngày)', fee: 30000, eta: '1-2 ngày' },
        { method: 'standard', name: 'Tiết kiệm (3-5 ngày)', fee: 20000, eta: '3-5 ngày' }
    ]);

    const [selectedShipping, setSelectedShipping] = useState<ShippingMethodPayload | null>(null);

    // payment method
    const [paymentMethod, setPaymentMethod] = useState<'ZALOPAY'>('ZALOPAY');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        const fetchVouchers = async () => {
            setIsLoadingVouchers(true);
            const res = await apiGetVouchers();
            if (res && res.success) {
                setVouchers(res.vouchers);
            } else {
                setToast({ message: res.message || 'Lỗi API voucher', type: 'error' });
            }
            setIsLoadingVouchers(false);
        };
        fetchVouchers()
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await apiGetProfile();
            if (data && data.success) {
                setProfile(data.user);
                // Tự động chọn địa chỉ mặc định hoặc địa chỉ đầu tiên từ profile
                if (data.user.address && data.user.address.length > 0) {
                    const defaultAddress = data.user.address.find((addr: AddressPayload) => addr.isDefault) || data.user.address[0];
                    if (defaultAddress) {
                        setAddress(defaultAddress);
                        // Tạo display string với tên, số điện thoại và địa chỉ đầy đủ
                        const addressParts = [];
                        if (defaultAddress.label) addressParts.push(defaultAddress.label);
                        if (defaultAddress.ward) addressParts.push(defaultAddress.ward);
                        if (defaultAddress.district) addressParts.push(defaultAddress.district);
                        if (defaultAddress.city) addressParts.push(defaultAddress.city);
                        const fullAddressStr = addressParts.length > 0 
                            ? addressParts.join(', ') 
                            : defaultAddress.fullAddress;
                        setAddressDisplay(`${data.user.fullname} • ${data.user.phone} • ${fullAddressStr}`);
                    }
                }
            } else {
                setToast({ message: data.message || 'Lỗi API profile', type: 'error' });
            }
        };
        fetchProfile();
    }, []);

    //tong tien
    const subtotal = useMemo(() => {
        return selectedItems.reduce((acc, item) => acc + (item.discountPercent > 0 ? item.discountPrice * item.quantity : item.basePrice * item.quantity), 0);
    }, [selectedItems]);

    // giam gia voucher - tinh theo discountType
    const discount = useMemo(() => {
        if (!selectedVoucher) return 0;

        const { discountType, discountValue, maxDiscount } = selectedVoucher;

        if (discountType === 'fixed') {
            return discountValue ?? 0;
        } else if (discountType === 'percentage') {
            // Auto-fix: Nếu discountValue > 1000 và maxDiscount < 1000, có thể bị đảo ngược
            let actualDiscountValue = discountValue ?? 0;
            let actualMaxDiscount = maxDiscount;
            
            if (discountValue && discountValue > 1000 && maxDiscount && maxDiscount < 1000) {
                // Đảo ngược giá trị
                actualDiscountValue = maxDiscount;
                actualMaxDiscount = discountValue;
            }
            
            // Tính toán giảm giá: subtotal * (actualDiscountValue / 100)
            let calculatedDiscount = Math.floor((subtotal * actualDiscountValue) / 100);
            
            // Áp dụng maxDiscount nếu có (giới hạn giảm giá tối đa)
            if (actualMaxDiscount && actualMaxDiscount > 0) {
                calculatedDiscount = Math.min(calculatedDiscount, actualMaxDiscount);
            }
            
            return calculatedDiscount;
        } else if (discountType === 'shipping') {
            // Voucher miễn phí ship - giảm phí ship
            return selectedShipping ? selectedShipping.fee : 0;
        }
        return 0;
    }, [selectedVoucher, subtotal, selectedShipping]);

    // phi ship
    const shippingFee = selectedShipping ? selectedShipping.fee : 0;

    // tong thanh toan
    const total = Math.max(subtotal + shippingFee - discount, 0);

    const handleSelectVoucher = async (v: VoucherPayload) => {
        // Validate voucher trước khi áp dụng
        try {
            const validateRes = await apiValidateVoucher(v.code, subtotal);
            if (validateRes.success) {
                setSelectedVoucher(v);
                setVoucherPopup(false);
                setToast({ message: `Áp dụng voucher ${v.code} thành công`, type: 'success' });
            } else {
                setToast({ message: validateRes.message || 'Không thể áp dụng voucher này', type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Lỗi khi kiểm tra voucher', type: 'error' });
        }
    };

    const handleRemoveVoucher = () => {
        setSelectedVoucher(null);
        setToast({ message: 'Đã hủy voucher', type: 'info' });
    }

    const handleSelectShipping = (m: ShippingMethodPayload) => {
        setSelectedShipping(m);
        setShippingPopup(false);
        setToast({ message: `Chọn vận chuyển: ${m.name}`, type: 'info' });
    };

    const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fullname = (form.elements.namedItem('fullname') as HTMLInputElement).value.trim();
        const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
        const fullAddress = (form.elements.namedItem('address') as HTMLInputElement).value.trim();
        const city = (form.elements.namedItem('city') as HTMLInputElement)?.value.trim() || '';
        const district = (form.elements.namedItem('district') as HTMLInputElement)?.value.trim() || '';
        const ward = (form.elements.namedItem('ward') as HTMLInputElement)?.value.trim() || '';

        if (!fullname || !phone || !fullAddress) {
            setToast({ message: 'Vui lòng điền đầy đủ thông tin địa chỉ!', type: 'warning' });
            return;
        }

        const addressData: AddressPayload = {
            label: 'Địa chỉ nhà',
            fullAddress: fullAddress,
            city: city,
            district: district,
            ward: ward,
            isDefault: false
        };

        const result = await apiUpdateAddress(addressData);
        if (result.success) {
            setToast({ message: 'Đã lưu địa chỉ', type: 'success' });
            setAddress(addressData);
            setAddressDisplay(`${fullname} • ${phone} • ${addressData.fullAddress}`);
            setShowAddressForm(false);
        } else {
            setToast({ message: result.message || 'Lỗi khi lưu địa chỉ', type: 'error' });
        }
    };

    const handlePlaceOrder = async () => {
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

        setIsPlacingOrder(true);

        try {
            // Map CartItem sang OrderItemPayload
            const orderItems = selectedItems.map(item => {
                // Lấy variantIndex từ item hoặc mặc định là 0
                const variantIndex = item.variantIndex ?? 0;

                return {
                    productId: item.productId,
                    variantIndex: variantIndex,
                    name: item.name,
                    sku: item.variant?.sku || '',
                    price: item.basePrice,
                    quantity: item.quantity
                };
            });

            // Map shipping method
            const shippingMethodPayload: ShippingMethodPayload = {
                name: selectedShipping.name,
                method: selectedShipping.method as 'fast' | 'standard',
                fee: selectedShipping.fee,
                eta: selectedShipping.eta || ''
            };

            const paymentPayload: PaymentPayload = {
                method: paymentMethod,
                status: 'pending'
            };

            // Tạo order payload
            const orderPayload = {
                items: orderItems,
                shippingAddress: address,
                voucherId: selectedVoucher?._id,
                voucherCode: selectedVoucher?.code,
                totalAmount: total,
                payment: paymentPayload,
                shippingMethod: shippingMethodPayload
            };

            // Bước 1: Tạo đơn hàng
            const result = await apiCreateOrder(orderPayload);

            if (!result.success) {
                setToast({ message: result.message || 'Đặt hàng thất bại', type: 'error' });
                return;
            }

            const orderId = result.order?.orderId || result.order?._id;
            if (!orderId) {
                setToast({ message: 'Không nhận được ID đơn hàng', type: 'error' });
                return;
            }

            // Bước 2: Tạo URL thanh toán ZaloPay
            let paymentUrlResult;
            if (paymentMethod === 'ZALOPAY') {
                paymentUrlResult = await apiCreateZaloPayPaymentUrl(orderId, total);
            } else {
                setToast({ message: 'Phương thức thanh toán không hợp lệ', type: 'error' });
                return;
            }

            if (paymentUrlResult.success && paymentUrlResult.paymentUrl) {
                // Redirect đến trang thanh toán
                window.location.href = paymentUrlResult.paymentUrl;
            } else {
                setToast({ message: paymentUrlResult.message || 'Lỗi khi tạo URL thanh toán', type: 'error' });
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            setToast({ message: 'Có lỗi xảy ra khi đặt hàng', type: 'error' });
        } finally {
            setIsPlacingOrder(false);
        }
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

                    {address && profile ? (
                        <div className={styles.addressInfo}>
                            <div className={styles.addressRow}>
                                <span className={styles.addressLabel}>Người nhận:</span>
                                <span className={styles.addressValue}>{profile.fullname}</span>
                            </div>
                            <div className={styles.addressRow}>
                                <span className={styles.addressLabel}>Số điện thoại:</span>
                                <span className={styles.addressValue}>{profile.phone}</span>
                            </div>
                            <div className={styles.addressRow}>
                                <span className={styles.addressLabel}>Loại địa chỉ:</span>
                                <span className={styles.addressValue}>{address.label}</span>
                            </div>
                            <div className={styles.addressRow}>
                                <span className={styles.addressLabel}>Địa chỉ:</span>
                                <div className={styles.addressFull}>
                                    {address.ward && (
                                        <span className={styles.addressPart}>{address.ward}</span>
                                    )}
                                    {address.district && (
                                        <span className={styles.addressPart}>{address.district}</span>
                                    )}
                                    {address.city && (
                                        <span className={styles.addressPart}>{address.city}</span>
                                    )}
                                    {address.fullAddress && !address.label && !address.ward && !address.district && !address.city && (
                                        <span className={styles.addressPart}>{address.fullAddress}</span>
                                    )}
                                </div>
                            </div>
                        </div>
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
                                <div className={styles.productRow} key={`${item.productId}_${item.variant?.size ?? ''}`}>
                                    <div className={styles.productLeft}>
                                        <Image src={item.image} alt={item.name} width={60} height={60} className={styles.thumb} />
                                        <div>
                                            <div className={styles.productName}>{item.name}</div>
                                            {item.variant?.size && <div className={styles.productMeta}>Size: {item.variant.size}</div>}
                                        </div>
                                    </div>
                                    <div className={styles.productRight}>
                                        <div className={styles.price}>{item.discountPercent > 0 ? formatCurrency(item.discountPrice) : formatCurrency(item.basePrice)}</div>
                                        <div className={styles.qty}>{item.quantity}</div>
                                        <div className={styles.lineTotal}>{formatCurrency(item.discountPercent > 0 ? item.discountPrice * item.quantity : item.basePrice * item.quantity)}</div>
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
                    <div className={styles.paymentMethods}>
                        <label className={`${styles.paymentOption} ${paymentMethod === 'ZALOPAY' ? styles.paymentOptionActive : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="ZALOPAY"
                                checked={paymentMethod === 'ZALOPAY'}
                                onChange={() => setPaymentMethod('ZALOPAY')}
                                className={styles.paymentRadio}
                            />
                            <div className={styles.paymentContent}>
                                <div className={styles.paymentIcon}>
                                    <img 
                                        src="data:image/png;base64,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" 
                                        alt="ZaloPay" 
                                        className={styles.paymentIconImg}
                                        onError={(e) => {
                                            // Fallback nếu ảnh không load được
                                            const target = e.currentTarget;
                                            target.style.display = 'none';
                                            const textElement = target.nextElementSibling as HTMLElement;
                                            if (textElement) {
                                                textElement.style.display = 'block';
                                            }
                                        }}
                                    />
                                    <span className={styles.paymentIconText}>ZP</span>
                                </div>
                                <div className={styles.paymentInfo}>
                                    <span className={styles.paymentName}>ZaloPay</span>
                                    <span className={styles.paymentDesc}>Thanh toán nhanh chóng và an toàn</span>
                                </div>
                                <div className={styles.paymentCheck}></div>
                            </div>
                        </label>
                    </div>
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
                        <button
                            className={styles.placeOrderBtn}
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                        >
                            {isPlacingOrder ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
                        </button>
                    </div>
                </div>
            </div>

            {showAddressForm && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h3 className={styles.popupTitle}>Địa chỉ nhận hàng</h3>
                        <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
                            <label className={styles.label}>Họ tên</label>
                            <input name="fullname" placeholder="Họ tên" required defaultValue={addressDisplay.split(' • ')[0] || ''} />
                            <label className={styles.label}>Số điện thoại</label>
                            <input name="phone" placeholder="Số điện thoại" required defaultValue={addressDisplay ? addressDisplay.split(' • ')[1] : ''} />
                            <label className={styles.label}>Địa chỉ chi tiết</label>
                            <input name="address" placeholder="Địa chỉ chi tiết" required defaultValue={address?.fullAddress || ''} />
                            <label className={styles.label}>Phường/Xã</label>
                            <input name="ward" placeholder="Phường/Xã" defaultValue={address?.ward || ''} />
                            <label className={styles.label}>Quận/Huyện</label>
                            <input name="district" placeholder="Quận/Huyện" defaultValue={address?.district || ''} />
                            <label className={styles.label}>Tỉnh/Thành phố</label>
                            <input name="city" placeholder="Tỉnh/Thành phố" defaultValue={address?.city || ''} />
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
                        <h3 className={styles.popupTitle}>Chọn voucher</h3>
                        <div className={styles.scrollList}>
                            {isLoadingVouchers ? (
                                <p>Đang tải mã giảm giá...</p>
                            ) : vouchers.length > 0 ? (
                                vouchers.map((v) => {
                                    // Hiển thị giá trị giảm giá theo loại voucher
                                    let displayValue = '';
                                    if (v.discountType === 'fixed') {
                                        displayValue = `-${formatCurrency(v.discountValue ?? 0)}`;
                                    } else if (v.discountType === 'percentage') {
                                        displayValue = `-${v.maxDiscount ?? 0}%`;
                                    } else if (v.discountType === 'shipping') {
                                        displayValue = 'Freeship';
                                    }
                                    
                                    return (
                                        <div
                                            key={v.code}
                                            className={styles.voucherItem}
                                            onClick={() => handleSelectVoucher(v)}
                                        >
                                            <div className={styles.voucherLeft}>
                                                <strong className={styles.voucherCode}>{v.code}</strong>
                                                <div className={styles.voucherMeta}>{v.name || v.description || ''}</div>
                                            </div>
                                            <div className={styles.voucherRight}>
                                                {displayValue}
                                            </div>
                                        </div>
                                    );
                                })
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
                        <h3 className={styles.popupTitle}>Chọn phương thức vận chuyển</h3>
                        <div className={styles.scrollList}>
                            {shippingMethod.map((m) => (
                                <div key={m.method} className={styles.voucherItem} onClick={() => handleSelectShipping(m)}>
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
    const { cartItems, refreshCart } = useCart();
    
    // Refresh cart khi component mount để đảm bảo dữ liệu mới nhất
    useEffect(() => {
        refreshCart();
    }, []);
    
    return (
        <SelectedItemsFetcher cartItems={cartItems}>
            {(selectedItems: CartItem[]) => <CheckoutContent selectedItems={selectedItems} />}
        </SelectedItemsFetcher>
    );
};

export default Checkout;

