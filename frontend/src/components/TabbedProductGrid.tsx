"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import styles from "../styles/TabbedProductGrid.module.css";
import { ProductDetailData } from "../types/product";
import { useRouter } from "next/navigation";

// Định nghĩa các tab và brand tương ứng
const tabs = [
    { id: "nike", name: "Giày Nike", brand: "Nike" },
    { id: "adidas", name: "Giày Adidas", brand: "Adidas" },
    { id: "mlb", name: "Giày MLB", brand: "MLB" },
    { id: "other", name: "Sản phẩm khác", brand: null },
];

interface TabbedProductGridProps {
    products: Array<ProductDetailData & { brand?: string }>;
}

const TabbedProductGrid = ({ products }: TabbedProductGridProps) => {
    const router = useRouter();
    // State để lưu tab đang được chọn, mặc định là 'nike'
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    const displayedProducts = products
        .filter((product) => {
            if (activeTabConfig?.brand === null) {
                // Tab "other": lấy các sản phẩm không thuộc các brand đã định nghĩa
                const definedBrands = tabs.filter(t => t.brand !== null).map(t => t.brand?.toLowerCase());
                return !product.brand || !definedBrands.includes(product.brand.toLowerCase());
            }
            return product.brand?.toLowerCase() === activeTabConfig?.brand?.toLowerCase();
        })
        .slice(0, 10);

    return (
        <section className={styles.gridContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>SẢN PHẨM NỔI BẬT</h2>
            </div>
            <nav className={styles.tabNav}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ""
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>
            <div className={styles.productDisplayGrid}>
                {displayedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} onClick={() => router.push(`/product/${product.variants[0].sku}`)} />
                ))}
            </div>
            <div className={styles.footer}>
                <button className={styles.viewAllButton}>Xem tất cả</button>
            </div>
        </section>
    );
};

export default TabbedProductGrid;