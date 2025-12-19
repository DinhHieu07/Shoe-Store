"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
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
        .slice(0, 10); // Chỉ lấy 10 sản phẩm cho slider trang chủ

    const settings = {
        dots: true,
        infinite: saleProducts.length > 5,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 2,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 375,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    // Nếu không có sản phẩm, không hiển thị component
    if (products.length === 0) {
        return null;
    }

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
                    onClick={() => router.push("/khuyen-mai")}
                >
                    Xem tất cả
                </button>
            </div>
        </section>
    );
};

export default ProductGrid;