"use client";

import React from "react";
import styles from "../styles/ProductCard.module.css";

export interface Product {
    _id: string;
    name: string;
    images: string[];
    discountPercent?: number;
    discountPrice?: number | string;
    basePrice: number | string;
    slug?: string;
}

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' 
            ? parseFloat(price.replace(/[^0-9]/g, '')) || 0 
            : price || 0;
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(numPrice);
    };

    const discountPercent = product.discountPercent ?? 0;
    const hasDiscount = discountPercent > 0;

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageContainer}>
                <img
                    src={product.images?.[0] || 'https://placehold.co/600x400'}
                    alt={product.name}
                    className={styles.productImage}
                />
                {hasDiscount && (
                    <div className={styles.discountTag}>
                        -{discountPercent}%
                    </div>
                )}
                <div className={styles.quickShopIcon}>
                    <i className="bx bx-shopping-bag"></i>
                </div>
            </div>
            <div className={styles.info}>
                <h4 className={styles.name}>{product.name}</h4>
                <div className={styles.price}>
                    {hasDiscount && product.discountPrice ? (
                        <>
                            <span className={styles.discountPrice}>{formatPrice(product.discountPrice)}</span>
                            <span className={styles.basePrice}>{formatPrice(product.basePrice)}</span>
                        </>
                    ) : (
                        <span className={styles.discountPrice}>{formatPrice(product.basePrice)}</span>
                    )}
                </div>
            </div>
        </div>

    );
};

export default ProductCard;