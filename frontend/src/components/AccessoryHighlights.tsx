"use client";

import React from "react";
import CategoryBannerGrid from "./CategoryBannerGrid";
import { Product } from "./ProductCard";
import styles from "../styles/AccessoryHighlights.module.css";

const bagProducts: Product[] = [
    {
        id: "b1",
        name: "Balo MLB Mini Monogram Jacquard Boston",
        imageUrl: "https://product.hstatic.net/200000581855/product/balo_mlb_mini_monogram_jacquard_boston_red_sox_7abkm032n-43bgs5_769c1f8b0e334125a35b8c8419acda23_large.jpg",
        discountPercent: 22,
        newPrice: 1750000,
        oldPrice: 2250000,
        slug: "balo-mlb-1",
    },
    {
        id: "b2",
        name: "Balo MLB Monogram Diamond Embo Mini",
        imageUrl: "https://product.hstatic.net/200000581855/product/_monogram_diamond_embo_mini_backpack_new_york_yankees_3abks051n-50bgd7_b2fd45ff2aee4a50a41c832eb0c543eb_large.png",
        discountPercent: 13,
        newPrice: 3690000,
        oldPrice: 4250000,
        slug: "balo-mlb-2",
    },
];

const hatProducts: Product[] = [
    {
        id: "h1",
        name: "Mũ MLB Basic Flex Mesh Cap",
        imageUrl: "https://product.hstatic.net/200000581855/product/basic-flex-mesh-cap-32cp74111-50l-mau-den-62b034843aa70-20062022154908_bd7a8c92a6364dfab51287cab4162274_grande.jpg",
        discountPercent: 0,
        newPrice: 850000,
        oldPrice: 850000,
        slug: "mu-mlb-1",
    },
    {
        id: "h2",
        name: "Mũ MLB Diamond Adjustable New York",
        imageUrl: "https://product.hstatic.net/200000581855/product/mu_mlb_diamond_adjustable_new_york_yankees_32cp85111-50q4_36dd3f1ed46c495eb13cf28cd38142dc_large.jpg",
        discountPercent: 19,
        newPrice: 890000,
        oldPrice: 1100000,
        slug: "mu-mlb-2",
    },
];

const AccessoryHighlights = () => {
    return (
        <div className={styles.container}>
            {/* Khối Túi MLB */}
            <CategoryBannerGrid
                title="TÚI MLB"
                bannerImage="https://file.hstatic.net/200000581855/file/5_fbd3fea1f7214bb785f536799f405eb4.png"
                bannerLink="/phu-kien/tui"
                viewAllLink="/phu-kien/tui"
                products={bagProducts}
            />

            {/* Khối Mũ MLB */}
            <CategoryBannerGrid
                title="MŨ MLB CHÍNH HÃNG"
                bannerImage="https://file.hstatic.net/200000581855/file/mu-mlb_14039e0fe80c4011bdaead1aa1b499df.png"
                bannerLink="/phu-kien/non"
                viewAllLink="/phu-kien/non"
                products={hatProducts}
            />
        </div>
    );
};

export default AccessoryHighlights;