// src/components/SalePageClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailData } from "../types/product";
import ProductCard from "./ProductCard";
import ProductSidebar from "./ProductSidebar"; // Tái sử dụng sidebar
import styles from "../styles/CategoryPage.module.css"; // Tái sử dụng style

interface SalePageClientProps {
    initialProducts: ProductDetailData[];
    title: string;
}

const SalePageClient: React.FC<SalePageClientProps> = ({
    initialProducts,
    title,
}) => {
    const router = useRouter();

    const [displayedProducts, setDisplayedProducts] =
        useState<ProductDetailData[]>([]);
    const [sortOrder, setSortOrder] = useState("default");
    const [filters, setFilters] = useState({}); // Dùng cho sidebar

    useEffect(() => {
        // --- LOGIC LỌC KHUYẾN MÃI ---
        const filtered = initialProducts.filter(
            (product) =>
                product.discountPercent > 0 ||
                product.discountPrice < parseInt(product.basePrice)
        );

        // TODO: Thêm logic lọc nâng cao (giá, size...) từ `filters`
        // TODO: Thêm logic sắp xếp từ `sortOrder`

        setDisplayedProducts(filtered);
    }, [initialProducts, filters, sortOrder]);

    return (
        // Tái sử dụng toàn bộ layout của trang danh mục
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>

                <div className={styles.sortContainer}>
                    <label htmlFor="sort">Sắp xếp:</label>
                    <select
                        id="sort"
                        className={styles.sortSelect}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="default">Mặc định</option>
                        <option value="price-asc">Giá: Tăng dần</option>
                        <option value="price-desc">Giá: Giảm dần</option>
                    </select>
                </div>
            </div>

            <div className={styles.mainContent}>
                {/* Cột trái: Sidebar */}
                <ProductSidebar categories={[]} priceRanges={[]} sizes={[]} activeCategory={null} activePriceRange={null} selectedSizes={[]} onCategoryChange={function (categoryName: string): void {
                    throw new Error("Function not implemented.");
                }} onPriceChange={function (rangeName: string): void {
                    throw new Error("Function not implemented.");
                }} onSizeChange={function (sizeName: string): void {
                    throw new Error("Function not implemented.");
                }} />
                {/* Cột phải: Lưới sản phẩm */}
                <div className={styles.productGrid}>
                    {displayedProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onClick={() =>
                                router.push(`/product/${product.variants[0].sku}`)
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalePageClient;