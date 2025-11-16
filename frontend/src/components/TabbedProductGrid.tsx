"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import styles from "../styles/TabbedProductGrid.module.css";
import { ProductDetailData } from "../types/product";
import { useRouter } from "next/navigation";

// --- THAY ĐỔI 1: Thêm 'href' vào mảng tabs ---
// Thêm đường dẫn (URL) cho mỗi tab
const tabs = [
    {
        id: "nike",
        name: "Giày Nike",
        brand: "Nike",
        href: "/giay-nike", // <-- Link cho Nike
    },
    {
        id: "adidas",
        name: "Giày Adidas",
        brand: "Adidas",
        href: "/giay-adidas", // <-- Link cho Adidas
    },
    {
        id: "mlb",
        name: "Giày MLB",
        brand: "MLB",
        href: "/giay-mlb", // <-- Link cho MLB
    },
    {
        id: "other",
        name: "Sản phẩm khác",
        brand: null,
        href: "/san-pham-khac", // <-- Link cho mục khác (bạn có thể đổi link này)
    },
];

interface TabbedProductGridProps {
    products: Array<ProductDetailData & { brand?: string }>;
}

const TabbedProductGrid = ({ products }: TabbedProductGridProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    // Biến này đã có sẵn, rất tiện lợi
    const activeTabConfig = tabs.find((tab) => tab.id === activeTab);

    const displayedProducts = products
        .filter((product) => {
            if (activeTabConfig?.brand === null) {
                const definedBrands = tabs
                    .filter((t) => t.brand !== null)
                    .map((t) => t.brand?.toLowerCase());
                return (
                    !product.brand || !definedBrands.includes(product.brand.toLowerCase())
                );
            }
            return (
                product.brand?.toLowerCase() === activeTabConfig?.brand?.toLowerCase()
            );
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
                    <ProductCard
                        key={product._id}
                        product={product}
                        onClick={() => router.push(`/product/${product.variants[0].sku}`)}
                    />
                ))}
            </div>

            {/* --- THAY ĐỔI 2: Thêm 'onClick' cho nút "Xem tất cả" --- */}
            <div className={styles.footer}>
                <button
                    className={styles.viewAllButton}
                    onClick={() => {
                        // Kiểm tra xem config của tab có tồn tại và có 'href' không
                        if (activeTabConfig && activeTabConfig.href) {
                            router.push(activeTabConfig.href);
                        }
                    }}
                >
                    Xem tất cả
                </button>
            </div>
        </section>
    );
};

export default TabbedProductGrid;