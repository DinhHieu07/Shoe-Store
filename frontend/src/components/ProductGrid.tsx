"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import styles from "../styles/ProductGrid.module.css";
import { useRouter } from "next/navigation";
import { apiGetProducts } from "@/services/apiProduct";
import { ProductDetailData } from "@/types/product";

const ProductGrid = () => {
    const router = useRouter();
    const [products, setProducts] = useState<ProductDetailData[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await apiGetProducts();
            if (response.success) {
                setProducts(response.products);
            }
        };
        fetchProducts();
    }, []);

    // --- LOGIC LỌC MỚI ---
    // Tự lọc các sản phẩm đang khuyến mãi từ prop
    const saleProducts = products
        .filter(
            (product) =>
                product.discountPercent > 0 ||
                product.discountPrice < parseInt(product.basePrice)
        )
        .slice(0, 10); // Chỉ lấy 10 sản phẩm cho trang chủ

    // Nếu không có sản phẩm, không hiển thị component
    if (products.length === 0 || saleProducts.length === 0) {
        return null;
    }

    return (
        <section className={styles.gridSection}>
            {/* Tiêu đề */}
            <div className={styles.header}>
                <i className={`bx bxs-zap ${styles.headerIcon}`}></i>
                <h3 className={styles.headerTitle}>Siêu Khuyến Mãi</h3>
            </div>

            {/* Grid với horizontal scroll */}
            <div className={styles.productGrid}>
                {saleProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onClick={() => router.push(`/product/${product.variants[0].sku}`)}
                    />
                ))}
            </div>

            {/* Nút Xem tất cả */}
            <div className={styles.viewAllContainer}>
                <button
                    className={styles.viewAllButton}
                    onClick={() => router.push("/khuyen-mai")}
                >
                    Xem tất cả
                </button>
            </div>
        </section>
    );
};

export default ProductGrid;