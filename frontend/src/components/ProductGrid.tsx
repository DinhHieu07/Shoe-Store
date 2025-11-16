// src/components/ProductGrid.tsx
"use client";

import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import styles from "../styles/ProductGrid.module.css";
import { ProductDetailData } from "../types/product"; // <-- Import type
import { useRouter } from "next/navigation"; // <-- IMPORT MỚI

// Định nghĩa props
interface ProductGridProps {
    products: ProductDetailData[]; // Nhận tất cả sản phẩm
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const router = useRouter(); // <-- KHỞI TẠO ROUTER

    // --- LOGIC LỌC MỚI ---
    // Tự lọc các sản phẩm đang khuyến mãi từ prop
    const saleProducts = products
        .filter(
            (product) =>
                product.discountPercent > 0 ||
                product.discountPrice < parseInt(product.basePrice)
        )
        .slice(0, 10); // Chỉ lấy 10 sản phẩm cho slider trang chủ

    // Cài đặt slider (bạn giữ nguyên của mình)
    const settings = {
        dots: true,
        infinite: saleProducts.length > 5,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 2,
        // ... (responsive settings của bạn)
    };

    return (
        <section className={styles.gridSection}>
            {/* Tiêu đề */}
            <div className={styles.header}>
                <i className={`bx bxs-zap ${styles.headerIcon}`}></i>
                <h3 className={styles.headerTitle}>Siêu Khuyến Mãi</h3>
            </div>

            {/* Slider */}
            <Slider {...settings} className={styles.productSlider}>
                {saleProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onClick={() => router.push(`/product/${product.variants[0].sku}`)}
                    />
                ))}
            </Slider>

            {/* Nút Xem tất cả */}
            <div className={styles.viewAllContainer}>
                {/* --- THAY ĐỔI Ở ĐÂY --- */}
                <button
                    className={styles.viewAllButton}
                    onClick={() => router.push("/khuyen-mai")} // <-- THÊM onClick
                >
                    Xem tất cả
                </button>
            </div>
        </section>
    );
};

export default ProductGrid;