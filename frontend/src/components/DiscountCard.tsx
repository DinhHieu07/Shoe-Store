import React from 'react';
import styles from '@/styles/ProductDetail.module.css';

import { VoucherPayload } from '@/types/voucher';

//chuyển đổi tiền
const formatAmountToK = (amount: number): string => {
    if (amount >= 1000) {
        return `${(amount / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}K`;
    }
    return amount.toLocaleString('vi-VN');
};

const formatExpiryDate = (date: Date | string | undefined): string => {
    if (!date) {
        return 'Vô thời hạn';
    }

    try {
        const d = (typeof date === 'string') ? new Date(date) : date;
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString('vi-VN');
    } catch (e) {
        return 'N/A';
    }
}

interface DiscountCardProps {
    voucher: VoucherPayload;
}

const DiscountCard: React.FC<DiscountCardProps> = ({ voucher }) => {
    if (!voucher) return null;
    const isFixed = voucher.discountType === 'fixed';
    const isPercentage = voucher.discountType === 'percentage';
    const isShipping = voucher.discountType === 'shipping';

    const valueDisplay = isShipping
        ? 'Freeship'
        : isFixed
            ? formatAmountToK(voucher.discountValue || 0)
            : `${voucher.discountValue || 0}%`;

    const title = isShipping
        ? 'Miễn Phí Vận Chuyển'
        : isFixed
            ? 'Giảm Giá Trực Tiếp'
            : 'Giảm Giá Phần Trăm';

    const minOrderDesc = (voucher.minOrderAmount || 0) > 0
        ? `Đơn hàng tối thiểu: ${formatAmountToK(voucher.minOrderAmount)}`
        : 'Áp dụng cho mọi đơn hàng';

    const handleCopy = () => {
        if (voucher.code) {
            navigator.clipboard.writeText(voucher.code);
            alert(`Đã sao chép mã: ${voucher.code}`);
        } else {
            alert('Không có mã để sao chép.');
        }
    };
    
    return (
        <div className={styles.discountCard}>
            <div className={styles.discountValueArea}>
                <span className={styles.discountValue}>{valueDisplay}</span>
            </div>

            <div className={styles.discountDetailsArea}>
                <h4 className={styles.discountTitle}>{title}</h4>
                <p className={styles.discountDecription}>
                    {voucher.description}
                </p>

                <div className={styles.discountMeta}>
                    <span className={styles.discountCodeLabel}>Mã: </span>
                    <span className={styles.discountCode}>{voucher.code}</span>
                </div>

                <div className={styles.expiryAndButtonRow}>
                    <span className={styles.discountExpiry}>HSD: {formatExpiryDate(voucher.expiryDate)}</span>
                    <button className={styles.copyButton} onClick={handleCopy}>Sao chép mã</button>
                </div>
                
            </div>
        </div>
    );
};
export default DiscountCard;
