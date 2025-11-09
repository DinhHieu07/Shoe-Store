"use client";

import React from "react";
import styles from "../styles/ProductCard.module.css";
export interface Product {
    id: string;
    name: string;
    imageUrl: string;
    discountPercent: number;
    newPrice: number;
    oldPrice: number;
    slug: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={styles.productImage}
                />
                {product.discountPercent > 0 && (
                    <div className={styles.discountTag}>
                        -{product.discountPercent}%
                    </div>
                )}
                <div className={styles.quickShopIcon}>
                    <i className="bx bx-shopping-bag"></i>
                </div>
            </div>
            <div className={styles.info}>
                <h4 className={styles.name}>{product.name}</h4>
                <div className={styles.price}>
                    <span className={styles.newPrice}>{formatPrice(product.newPrice)}</span>
                    <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
                </div>
            </div>
        </div>

    );
};

export default ProductCard;