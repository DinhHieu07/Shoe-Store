"use client";

import React, { useEffect, useState } from "react";
import CategoryBannerGrid from "./CategoryBannerGrid";
import { Product } from "./ProductCard";
import styles from "../styles/AccessoryHighlights.module.css";
import { apiGetProductsByCategory } from "../services/apiProduct";

const AccessoryHighlights = () => {
    const [bagProducts, setBagProducts] = useState<Product[]>([]);
    const [hatProducts, setHatProducts] = useState<Product[]>([]);
    const [isLoadingBags, setIsLoadingBags] = useState(true);
    const [isLoadingHats, setIsLoadingHats] = useState(true);

    useEffect(() => {
        // Lấy sản phẩm túi
        const fetchBagProducts = async () => {
            setIsLoadingBags(true);
            try {
                const res = await apiGetProductsByCategory("Túi");
                if (res.success && res.products) {
                    // Format dữ liệu để phù hợp với Product interface
                    const formattedProducts: Product[] = res.products.map((p: any) => ({
                        _id: p._id,
                        name: p.name,
                        images: p.images || [],
                        discountPercent: p.discountPercent || 0,
                        discountPrice: p.discountPrice || p.basePrice,
                        basePrice: p.basePrice,
                        slug: p.variants && p.variants.length > 0 ? p.variants[0].sku : p.slug || p._id,
                    }));
                    setBagProducts(formattedProducts);
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm túi:", error);
            } finally {
                setIsLoadingBags(false);
            }
        };

        // Lấy sản phẩm mũ
        const fetchHatProducts = async () => {
            setIsLoadingHats(true);
            try {
                const res = await apiGetProductsByCategory("Nón");
                if (res.success && res.products) {
                    // Format dữ liệu để phù hợp với Product interface
                    const formattedProducts: Product[] = res.products.map((p: any) => ({
                        _id: p._id,
                        name: p.name,
                        images: p.images || [],
                        discountPercent: p.discountPercent || 0,
                        discountPrice: p.discountPrice || p.basePrice,
                        basePrice: p.basePrice,
                        slug: p.variants && p.variants.length > 0 ? p.variants[0].sku : p.slug || p._id,
                    }));
                    setHatProducts(formattedProducts);
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm mũ:", error);
            } finally {
                setIsLoadingHats(false);
            }
        };

        fetchBagProducts();
        fetchHatProducts();
    }, []);

    return (
        <div className={styles.container}>
            {/* Khối Túi MLB */}
            {!isLoadingBags && (
                <CategoryBannerGrid
                    title="TÚI MLB"
                    bannerImage="https://file.hstatic.net/200000581855/file/5_fbd3fea1f7214bb785f536799f405eb4.png"
                    bannerLink="/phu-kien/tui"
                    viewAllLink="/phu-kien/tui"
                    products={bagProducts}
                />
            )}

            {/* Khối Mũ MLB */}
            {!isLoadingHats && (
                <CategoryBannerGrid
                    title="MŨ MLB CHÍNH HÃNG"
                    bannerImage="https://file.hstatic.net/200000581855/file/mu-mlb_14039e0fe80c4011bdaead1aa1b499df.png"
                    bannerLink="/phu-kien/non"
                    viewAllLink="/phu-kien/non"
                    products={hatProducts}
                />
            )}
        </div>
    );
};

export default AccessoryHighlights;