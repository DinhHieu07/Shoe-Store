"use client";

import React from "react";
import styles from "../styles/ProductSidebar.module.css";

// --- Định nghĩa props mà component sẽ nhận ---
interface ProductSidebarProps {
    categories: { name: string; count: number }[];
    priceRanges: { name: string }[];
    sizes: { name: string }[];
    activeCategory: string | null;
    activePriceRange: string | null;
    selectedSizes: string[];
    onCategoryChange: (categoryName: string) => void;
    onPriceChange: (rangeName: string) => void;
    onSizeChange: (sizeName: string) => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
    categories,
    priceRanges,
    sizes,
    activeCategory,
    activePriceRange,
    selectedSizes,
    onCategoryChange,
    onPriceChange,
    onSizeChange,
}) => {
    return (
        <aside className={styles.sidebar}>
            {/* Khối Danh mục (Chọn 1) */}
            <div className={styles.filterBlock}>
                <h3 className={styles.filterTitle}>Danh mục sản phẩm</h3>
                <ul className={styles.filterList}>
                    {categories.map((cat) => (
                        <li key={cat.name} className={styles.filterItem}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="category"
                                    value={cat.name}
                                    checked={activeCategory === cat.name} // <-- Nhận state
                                    onChange={() => onCategoryChange(cat.name)} // <-- Gọi hàm
                                />
                                <span>{cat.name}</span>
                                <span className={styles.itemCount}>({cat.count})</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Khối Lọc Giá (Chọn 1) */}
            <div className={styles.filterBlock}>
                <h3 className={styles.filterTitle}>Lọc Giá</h3>
                <ul className={styles.filterList}>
                    {priceRanges.map((range) => (
                        <li key={range.name} className={styles.filterItem}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="price"
                                    value={range.name}
                                    checked={activePriceRange === range.name} // <-- Nhận state
                                    onChange={() => onPriceChange(range.name)} // <-- Gọi hàm
                                />
                                <span>{range.name}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Khối Kích thước (Chọn nhiều) */}
            <div className={styles.filterBlock}>
                <h3 className={styles.filterTitle}>Kích thước</h3>
                <ul className={styles.filterList}>
                    {sizes.map((size) => (
                        <li key={size.name} className={styles.filterItem}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="size"
                                    value={size.name}
                                    checked={selectedSizes.includes(size.name)} // <-- Nhận state
                                    onChange={() => onSizeChange(size.name)} // <-- Gọi hàm
                                />
                                <span>{size.name}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default ProductSidebar;