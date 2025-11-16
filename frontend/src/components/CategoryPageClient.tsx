// src/components/CategoryPageClient.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailData } from "../types/product";
import ProductCard from "./ProductCard";
import ProductSidebar from "./ProductSidebar";
import styles from "../styles/CategoryPage.module.css";

// --- CẤU HÌNH BỘ LỌC TĨNH ---
// Bảng ánh xạ Slug sang Filter (Giữ nguyên logic cũ của bạn)
const SLUG_FILTERS = {
    "giay-nike": { type: "brand", value: "Nike" },
    "giay-adidas": { type: "brand", value: "Adidas" },
    "giay-mlb": { type: "brand", value: "MLB" },
    "phu-kien": { type: "category-group", value: ["Áo", "Túi", "Nón"] },
    "ao": { type: "category", value: "Áo" },
    "tui": { type: "category", value: "Túi" },
    "non": { type: "category", value: "Nón" },
};
const ACCESSORY_CATEGORIES = ["áo", "túi", "nón"];

// Các khoảng giá (Bạn có thể sửa đổi)
const PRICE_RANGES = [
    { name: "Dưới 500,000đ", min: 0, max: 500000 },
    { name: "500,000đ - 1,000,000đ", min: 500000, max: 1000000 },
    { name: "1,000,000₫ - 2,000,000₫", min: 1000000, max: 2000000 },
    { name: "Trên 2,000,000đ", min: 2000000, max: Infinity },
];

interface CategoryPageClientProps {
    initialProducts: ProductDetailData[];
    slugParts: string[];
}

const CategoryPageClient: React.FC<CategoryPageClientProps> = ({
    initialProducts,
    slugParts,
}) => {
    const router = useRouter();

    // --- STATE QUẢN LÝ BỘ LỌC ---
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activePriceRange, setActivePriceRange] = useState<string | null>(null);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState("default");

    // State cho sản phẩm hiển thị và tiêu đề
    const [displayedProducts, setDisplayedProducts] = useState<ProductDetailData[]>([]);
    const [title, setTitle] = useState("");

    // --- TẠO DỮ LIỆU CHO SIDEBAR ---
    // (Chỉ chạy 1 lần)
    const { categoriesForSidebar, sizesForSidebar } = useMemo(() => {
        const categoryCount: Record<string, number> = {};
        const sizeSet = new Set<string>();

        initialProducts.forEach((product) => {
            // 1. Đếm Danh mục
            const categoryName = product.category || "Chưa phân loại";
            categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;

            // 2. Đếm Brand
            const brandName = product.brand;
            if (brandName) {
                categoryCount[brandName] = (categoryCount[brandName] || 0) + 1;
            }

            // 3. Lấy Kích thước (Từ yêu cầu của bạn)
            product.variants.forEach((variant) => {
                if (variant.size) sizeSet.add(variant.size);
            });
        });

        // Chuyển map/set thành mảng cho sidebar
        const categories = Object.keys(categoryCount).map(name => ({
            name,
            count: categoryCount[name]
        }));
        const sizes = Array.from(sizeSet).sort().map(name => ({ name }));

        return { categoriesForSidebar: categories, sizesForSidebar: sizes };
    }, [initialProducts]);


    // --- BỘ NÃO LỌC VÀ SẮP XẾP ---
    useEffect(() => {
        let filtered = [...initialProducts];
        let pageTitle = "";

        // === LỌC CẤP 1: LỌC THEO URL (slug) hoặc SIDEBAR (activeCategory) ===
        // Ưu tiên bộ lọc sidebar. Nếu sidebar chưa chọn gì, lọc theo URL.
        const categoryToFilter = activeCategory;

        if (categoryToFilter) {
            // 1.1 Lọc theo Sidebar (Brand hoặc Category)
            pageTitle = categoryToFilter;
            filtered = filtered.filter(p =>
                p.brand?.toLowerCase() === categoryToFilter.toLowerCase() ||
                p.category?.toLowerCase() === categoryToFilter.toLowerCase()
            );
        } else {
            // 1.2 Lọc theo URL (slugParts) - Logic cũ của bạn
            const [mainSlug, subSlug] = slugParts;
            const mainFilter = SLUG_FILTERS[mainSlug as keyof typeof SLUG_FILTERS];
            if (mainFilter) {
                // (Lọc theo brand, category-group, sub-slug... giữ nguyên logic cũ)
                if (mainFilter.type === "brand") {
                    filtered = filtered.filter(p =>
                        p.brand?.toLowerCase() === (mainFilter.value as string).toLowerCase() &&
                        !ACCESSORY_CATEGORIES.includes(p.category?.toLowerCase())
                    );
                    pageTitle = mainFilter.value as string;
                } else if (mainFilter.type === "category-group") {
                    const categories = (mainFilter.value as string[]).map(c => c.toLowerCase());
                    filtered = filtered.filter(p => categories.includes(p.category?.toLowerCase()));
                    pageTitle = "Phụ Kiện";
                }
                // (Bạn có thể thêm lại logic subSlug ở đây nếu muốn)
            } else {
                pageTitle = mainSlug ? mainSlug.replace(/-/g, " ") : "Sản phẩm";
            }
        }

        // === LỌC CẤP 2: LỌC GIÁ (từ Sidebar) ===
        if (activePriceRange) {
            const range = PRICE_RANGES.find(r => r.name === activePriceRange);
            if (range) {
                filtered = filtered.filter(p =>
                    p.discountPrice >= range.min && p.discountPrice < range.max
                );
            }
        }

        // === LỌC CẤP 3: LỌC KÍCH THƯỚC (từ Sidebar) ===
        if (selectedSizes.length > 0) {
            filtered = filtered.filter(product =>
                product.variants.some(variant =>
                    selectedSizes.includes(variant.size)
                )
            );
        }

        // === SẮP XẾP (Cuối cùng) ===
        if (sortOrder === "price-asc") {
            filtered.sort((a, b) => a.discountPrice - b.discountPrice);
        } else if (sortOrder === "price-desc") {
            filtered.sort((a, b) => b.discountPrice - a.discountPrice);
        }

        // Cập nhật kết quả
        setDisplayedProducts(filtered);
        setTitle(pageTitle); // Giữ tiêu đề

    }, [
        initialProducts,
        slugParts,
        activeCategory,
        activePriceRange,
        selectedSizes,
        sortOrder,
        title, // Thêm title để tránh warning
    ]);

    // --- HÀM XỬ LÝ (Truyền xuống Sidebar) ---
    // Yêu cầu 1: Chỉ chọn 1 danh mục
    const handleCategoryChange = (categoryName: string) => {
        setActiveCategory(prev => (prev === categoryName ? null : categoryName));
    };

    // Yêu cầu 1: Chỉ chọn 1 khoảng giá
    const handlePriceChange = (rangeName: string) => {
        setActivePriceRange(prev => (prev === rangeName ? null : rangeName));
    };

    // Yêu cầu 1: Chọn nhiều kích thước
    const handleSizeChange = (sizeName: string) => {
        setSelectedSizes(prev =>
            prev.includes(sizeName)
                ? prev.filter(s => s !== sizeName) // Bỏ chọn
                : [...prev, sizeName] // Thêm chọn
        );
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                {/* Yêu cầu 2: Sắp xếp */}
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
                {/* CỘT TRÁI: Truyền state và hàm xử lý xuống */}
                <ProductSidebar
                    categories={categoriesForSidebar}
                    priceRanges={PRICE_RANGES}
                    sizes={sizesForSidebar}
                    activeCategory={activeCategory}
                    activePriceRange={activePriceRange}
                    selectedSizes={selectedSizes}
                    onCategoryChange={handleCategoryChange}
                    onPriceChange={handlePriceChange}
                    onSizeChange={handleSizeChange}
                />

                {/* CỘT PHẢI: Hiển thị sản phẩm đã lọc */}
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

export default CategoryPageClient;