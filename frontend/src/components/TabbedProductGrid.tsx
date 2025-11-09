"use client";

import React, { useState } from "react";
import ProductCard, { Product } from "./ProductCard";
import styles from "../styles/TabbedProductGrid.module.css";

const nikeProducts: Product[] = [
    {
        id: "n1",
        name: "Giày Nike Air Force 1 '07",
        imageUrl: "https://product.hstatic.net/200000581855/product/air-force-1-07-lv8-mens-shoes-x9flng.png_99d3aac8e9ed4bf89ad0f36dd0db310d_grande.jpeg",
        discountPercent: 0,
        newPrice: 3850000,
        oldPrice: 3850000,
        slug: "nike-af1-07",
    },
    {
        id: "n2",
        name: "Giày Nike Air Force 1 '07 M All White",
        imageUrl: "https://product.hstatic.net/200000581855/product/air-force-1-07-mens-shoe-j16cjp.png-7_f7aefda6f2ca4636a9fe7b08f695e63b_large.jpeg",
        discountPercent: 18,
        newPrice: 2490000,
        oldPrice: 3050000,
        slug: "nike-af1-all-white",
    },
    {
        id: "n3",
        name: "Giày Nike Air Max 270 React 'White'",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2023/07/Nike-Air-Max-270-White-AH8050-100.jpg",
        discountPercent: 10,
        newPrice: 3990000,
        oldPrice: 4400000,
        slug: "nike-air-max-270-react",
    },
    {
        id: "n4",
        name: "Giày Nike Air Max 90 'White Grey'",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2025/03/Giay-Nike-Air-Max-90-White-College-Grey-Vast-Grey-University-Red-DM0029-113.jpg",
        discountPercent: 15,
        newPrice: 3400000,
        oldPrice: 3990000,
        slug: "nike-air-max-90-white-grey",
    },
    {
        id: "n5",
        name: "Giày Nike Blazer Mid '77 Vintage",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2023/11/Giay-Nike-Blazer-Mid-77-Vintage-Recycled-Wool-Pack-White-Light-Smoke-Grey-CW6726-100-1.jpg",
        discountPercent: 20,
        newPrice: 2800000,
        oldPrice: 3500000,
        slug: "nike-blazer-mid-77-vintage",
    },
    {
        id: "n6",
        name: "Giày Nike React Infinity Run Flyknit 2",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2024/01/Giay-Nike-React-Infinity-Run-Flyknit-Black-Pink-Blast-WMNS-CD4372-009-1.jpg",
        discountPercent: 15,
        newPrice: 4200000,
        oldPrice: 4900000,
        slug: "nike-react-infinity-run-flyknit-2",
    },
    {
        id: "n7",
        name: "Giày Nike Air Zoom Pegasus 37",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2024/09/Giay-Nike-Air-Zoom-Pegasus-41-Coconut-Milk-Pink-HM3703-161.jpg",
        discountPercent: 10,
        newPrice: 3800000,
        oldPrice: 4200000,
        slug: "nike-air-zoom-pegasus-37",
    },
    {
        id: "n8",
        name: "Giày Nike Air Jordan 1 'Panda'",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2023/04/Giay-Nike-Air-Jordan-1-Low-Panda-DC0774-101.jpg",
        discountPercent: 5,
        newPrice: 4500000,
        oldPrice: 4750000,
        slug: "nike-air-jordan-1-panda",
    },
    {
        id: "n9",
        name: "Giày Nike Air Jordan 1 Low White Wolf Grey",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_nike_air_jordan_1_low_white_wolf_grey_w_dc0774-10511_d4167782465545ecbdcf7ec4439196c6_compact.jpeg",
        discountPercent: 10,
        newPrice: 4200000,
        oldPrice: 4600000,
        slug: "nike-air-jordan-1-low-white-wolf-grey",
    },
    {
        id: "n10",
        name: "Giày Nike Killshot 2 Midnight Navy",
        imageUrl: "https://product.hstatic.net/200000581855/product/killshot-2-leather-mens-shoe-zrq1wk.png_de6c75d6a5dc4e2ea7148aa17661969f_compact.jpeg",
        discountPercent: 10,
        newPrice: 3500000,
        oldPrice: 3900000,
        slug: "nike-killshot-2-midnight-navy",
    },
];

const adidasProducts: Product[] = [
    {
        id: "a1",
        name: "Giày Adidas Samba OG 'White'",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_adidas_samba_og_pink_cloud_white_ih27518_742c147038cf4cf5b1b01c10a6071c47_compact.jpeg",
        discountPercent: 0,
        newPrice: 3200000,
        oldPrice: 3200000,
        slug: "adidas-samba-og",
    },

];

const mlbProducts: Product[] = [
    {
        id: "m1",
        name: "Giày MLB Chunky Liner 'New York'",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_mlb_chunky_liner_mid_classic_monogram_boston_3asxlm13n-43bgl10_21c509f985ed4c12a4dcf08b5c351d1d_grande.jpg",
        discountPercent: 10,
        newPrice: 2990000,
        oldPrice: 3300000,
        slug: "mlb-chunky-liner",
    },

];

const otherProducts: Product[] = [
    {
        id: "o1",
        name: "Giày Converse Chuck 70 High",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_converse_chuck_taylor_all_star_move_568497c7_ffe249596c12464ba08ace3eed5973b9_grande.jpg",
        discountPercent: 0,
        newPrice: 1850000,
        oldPrice: 1850000,
        slug: "converse-chuck-70",
    },

];

// Map dữ liệu với key của tab
const productLists: Record<string, Product[]> = {
    nike: nikeProducts,
    adidas: adidasProducts,
    mlb: mlbProducts,
    other: otherProducts,
};

// Định nghĩa các tab
const tabs = [
    { id: "nike", name: "Giày Nike" },
    { id: "adidas", name: "Giày Adidas" },
    { id: "mlb", name: "Giày MLB" },
    { id: "other", name: "Sản phẩm khác" },
];

const TabbedProductGrid = () => {
    // State để lưu tab đang được chọn, mặc định là 'nike'
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const displayedProducts = (productLists[activeTab] || []).slice(0, 10);

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
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <div className={styles.footer}>
                <button className={styles.viewAllButton}>Xem tất cả</button>
            </div>
        </section>
    );
};

export default TabbedProductGrid;