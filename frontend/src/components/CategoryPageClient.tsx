// src/components/CategoryPageClient.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailData } from "../types/product";
import ProductCard from "./ProductCard";
import ProductSidebar from "./ProductSidebar";
import styles from "../styles/CategoryPage.module.css";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

// --- BẢNG ÁNH XẠ SLUG (ĐÃ SỬA VÀ BỔ SUNG ĐẦY ĐỦ) ---
const SLUG_FILTERS: {
    [key: string]: {
        type: "brand" | "category" | "category-group" | "other";
        value: string | string[] | null;
    };
} = {
    // Lọc theo Brand
    "giay-nike": { type: "brand", value: "Nike" },
    "giay-adidas": { type: "brand", value: "Adidas" },
    "giay-mlb": { type: "brand", value: "MLB" },

    // Lọc theo Phụ kiện (Cấp 1)
    "phu-kien": { type: "category-group", value: ["Áo", "Túi", "Nón"] },

    // Lọc theo Phụ kiện (Cấp 2) - ĐÃ BỔ SUNG LẠI
    "ao": { type: "category", value: "Áo" },
    "tui": { type: "category", value: "Túi" },
    "non": { type: "category", value: "Nón" },

    // Lọc khác
    "san-pham-khac": { type: "other", value: null },
};
// ------------------------------------------

// Danh sách category phụ kiện (để loại trừ)
const ACCESSORY_CATEGORIES = ["áo", "túi", "nón"];

// Khoảng giá (giữ nguyên)
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

    // --- Quản lý State (giữ nguyên) ---
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activePriceRange, setActivePriceRange] = useState<string | null>(null);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState("default");
    const [displayedProducts, setDisplayedProducts] = useState<ProductDetailData[]>([]);
    const [title, setTitle] = useState("");

    // --- useMemo (giữ nguyên) ---
    const { categoriesForSidebar, sizesForSidebar } = useMemo(() => {
        const categoryCount: Record<string, number> = {};
        const sizeSet = new Set<string>();
        initialProducts.forEach((product) => {
            const categoryName = product.category || "Chưa phân loại";
            categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
            const brandName = product.brand;
            if (brandName) {
                categoryCount[brandName] = (categoryCount[brandName] || 0) + 1;
            }
            product.variants.forEach((variant) => {
                if (variant.size) sizeSet.add(variant.size);
            });
        });
        const categories = Object.keys(categoryCount).map(name => ({
            name,
            count: categoryCount[name]
        }));
        const sizes = Array.from(sizeSet).sort().map(name => ({ name }));
        return { categoriesForSidebar: categories, sizesForSidebar: sizes };
    }, [initialProducts]);

    // --- useEffect (Logic lọc chính) ---
    useEffect(() => {
        let filtered = [...initialProducts];
        let pageTitle = "";

        const categoryToFilter = activeCategory;

        if (categoryToFilter) {
            // 1. Lọc theo Sidebar
            pageTitle = categoryToFilter;
            filtered = filtered.filter(p =>
                p.brand?.toLowerCase() === categoryToFilter.toLowerCase() ||
                p.category?.toLowerCase() === categoryToFilter.toLowerCase()
            );
        } else {
            // 2. Lọc theo URL
            const [mainSlug, subSlug] = slugParts;
            
            // Xử lý trang khuyến mãi
            if (mainSlug === "khuyen-mai") {
                // Chỉ hiển thị sản phẩm có khuyến mãi
                filtered = filtered.filter(p => {
                    const discountPercent = typeof p.discountPercent === 'number' ? p.discountPercent : parseFloat(String(p.discountPercent || 0));
                    const discountPrice = typeof p.discountPrice === 'number' ? p.discountPrice : parseFloat(String(p.discountPrice || 0));
                    const basePrice = typeof p.basePrice === 'number' ? p.basePrice : parseFloat(String(p.basePrice || 0));
                    // Sản phẩm có khuyến mãi khi discountPercent > 0 hoặc discountPrice < basePrice
                    return discountPercent > 0 || (discountPrice > 0 && discountPrice < basePrice);
                });
                pageTitle = "Khuyến Mãi";
            } else {
                const mainFilter = SLUG_FILTERS[mainSlug as keyof typeof SLUG_FILTERS];

                if (mainFilter) {
                    // LỌC CẤP 1 (mainSlug)
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
                    } else if (mainFilter.type === "other") {
                        // (logic "other" của bạn)
                    }

                    // LỌC CẤP 2 (subSlug) - Logic này giờ sẽ chạy đúng
                    if (subSlug) {
                        const subFilter = SLUG_FILTERS[subSlug as keyof typeof SLUG_FILTERS];
                        if (subFilter && subFilter.type === "category") {
                            // Lọc cho /phu-kien/tui
                            filtered = filtered.filter(
                                (p) =>
                                    p.category?.toLowerCase() ===
                                    (subFilter.value as string).toLowerCase()
                            );
                            pageTitle = subFilter.value as string;
                        } else {
                            // Lọc cho /giay-nike/air-force-1
                            const searchTerm = subSlug.replace(/-/g, " ").toLowerCase();
                            filtered = filtered.filter((p) =>
                                p.name.toLowerCase().includes(searchTerm)
                            );
                            pageTitle = subSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
                        }
                    }
                } else {
                    pageTitle = mainSlug ? mainSlug.replace(/-/g, " ") : "Sản phẩm";
                    filtered = []; // Không tìm thấy slug thì không hiển thị gì
                }
            }
        }

        // --- Lọc Giá & Kích thước (giữ nguyên) ---
        if (activePriceRange) {
            const range = PRICE_RANGES.find(r => r.name === activePriceRange);
            if (range) {
                filtered = filtered.filter(p =>
                    p.discountPrice >= range.min && p.discountPrice < range.max
                );
            }
        }
        if (selectedSizes.length > 0) {
            filtered = filtered.filter(product =>
                product.variants.some(variant =>
                    selectedSizes.includes(variant.size)
                )
            );
        }

        // --- Sắp xếp (giữ nguyên) ---
        if (sortOrder === "price-asc") {
            filtered.sort((a, b) => a.discountPrice - b.discountPrice);
        } else if (sortOrder === "price-desc") {
            filtered.sort((a, b) => b.discountPrice - a.discountPrice);
        }

        // --- Cập nhật State (giữ nguyên) ---
        setDisplayedProducts(filtered);
        setTitle(pageTitle);

    }, [
        initialProducts,
        slugParts,
        activeCategory,
        activePriceRange,
        selectedSizes,
        sortOrder,
    ]);

    // --- Hàm xử lý (giữ nguyên) ---
    const handleCategoryChange = (categoryName: string) => {
        setActiveCategory(prev => (prev === categoryName ? null : categoryName));
    };
    const handlePriceChange = (rangeName: string) => {
        setActivePriceRange(prev => (prev === rangeName ? null : rangeName));
    };
    const handleSizeChange = (sizeName: string) => {
        setSelectedSizes(prev =>
            prev.includes(sizeName)
                ? prev.filter(s => s !== sizeName)
                : [...prev, sizeName]
        );
    };

    // --- JSX (giữ nguyên) ---
    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title || "Sản phẩm"}</h1>
                <Box sx={{ minWidth: 120, marginBottom: '20px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="sort-select-label">Sắp xếp</InputLabel>
                        <Select
                            labelId="sort-select-label"
                            id="sort-select"
                            label="Sắp xếp"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            MenuProps={{
                                disableScrollLock: true,
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
                        >
                            <MenuItem value="default">Mặc định</MenuItem>
                            <MenuItem value="price-asc">Giá: Tăng dần</MenuItem>
                            <MenuItem value="price-desc">Giá: Giảm dần</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>

            <div className={styles.mainContent}>
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

                {displayedProducts.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Không có sản phẩm nào phù hợp</p>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default CategoryPageClient;