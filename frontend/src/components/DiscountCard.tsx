import React from 'react';
import styles from '@/styles/ProductDetail.module.css';

interface DiscountCode {
    _id: string;
    name: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscount?: number;
    minOrderAmount: number;
    expiryDate?: Date | string;
}

interface DiscountCardProps {
    discount: DiscountCode;
}

//chuyển đổi tiền
const formatAmountToK = (amount: number): string => {
    if(amount >= 1000){
        return `${(amount / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}K`;
    }
    return amount.toLocaleString('vi-VN');
};

const formatExpiryDate = (date: Date | string | undefined): string => {
    if (!date) {
        return 'Vô thời hạn'; 
    }

    try{
        const d=(typeof date === 'string') ? new Date(date) : date;
        if(isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString('vi-VN');
    } catch(e) {
        return 'N/A';
    }
}

const DiscountCard: React.FC<DiscountCardProps> = ({ discount }) => {
    const isFixed = discount.discountType === 'fixed';
    const valueDisplay = isFixed
        ? formatAmountToK(discount.discountValue)
        : `${discount.discountValue}%`;
    const title = isFixed ? 'Giảm Giá Trực Tiếp' : 'Giảm Giá Phần Trăm';
    const minOrderDesc = discount.minOrderAmount > 0
        ? `Đơn hàng tối thiểu: ${formatAmountToK(discount.minOrderAmount)}`
        : 'Áp dụng cho mọi đơn hàng';
    const handleCopy = () => {
        if(discount.code){
            navigator.clipboard.writeText(discount.code);
            alert(`Đã sao chép mã: ${discount.code}`);
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
                    {discount.description}
                </p>

                <div className={styles.discountMeta}>
                    <span className={styles.discountCodeLabel}>Mã: </span>
                    <span className={styles.discountCode}>{discount.code}</span>
                </div>
                <span className={styles.discountExpiry}>HSD: {formatExpiryDate(discount.expiryDate)}</span>

                <button className={styles.copyButton} onClick={handleCopy}>Sao chép mã</button>
            </div>
        </div>
    );
};
export default DiscountCard;
