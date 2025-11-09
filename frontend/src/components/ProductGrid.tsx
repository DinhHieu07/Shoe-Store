"use client";

import React from "react";
import Slider from "react-slick";
import ProductCard, { Product } from "./ProductCard";
import styles from "../styles/ProductGrid.module.css";

const sampleProducts: Product[] = [
    {
        id: "1",
        name: "Giày New Balance 530 White Natural Indigo",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_new_balance_530_white_natural_indigo__gs__gr530sb11_dfeeb48a1faa4c04b75091c3af767075_large.jpg",
        discountPercent: 25,
        newPrice: 2090000,
        oldPrice: 2790000,
        slug: "nb-530-white",
    },
    {
        id: "2",
        name: "Giày New Balance Pro Court Beige Navy",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_new_balance_pro_court_beige_navy_proctccf__3__4c91e81dbd7a47c0b00501dd2ef8ea42_large.jpg",
        discountPercent: 23,
        newPrice: 1890000,
        oldPrice: 2450000,
        slug: "nb-pro-court",
    },
    {
        id: "3",
        name: "Giày Nike Air Jordan 1 Low Panda",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_nike_air_jordan_1_low_panda_w_dc0774-1014_0416e0b3b8ad4425aa489da3d25adfb0_large.jpeg",
        discountPercent: 38,
        newPrice: 2790000,
        oldPrice: 4500000,
        slug: "jordan-1-panda",
    },
    {
        id: "4",
        name: "Giày Nike Air Jordan 1 Low White Wolf Grey",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_nike_air_jordan_1_low_white_wolf_grey_w_dc0774-10511_d4167782465545ecbdcf7ec4439196c6_large.jpeg",
        discountPercent: 33,
        newPrice: 2690000,
        oldPrice: 3990000,
        slug: "jordan-1-wolf-grey",
    },
    {
        id: "5",
        name: "Giày Nike Killshot 2 Midnight Navy",
        imageUrl: "https://product.hstatic.net/200000581855/product/killshot-2-leather-mens-shoe-zrq1wk.png_de6c75d6a5dc4e2ea7148aa17661969f_large.jpeg",
        discountPercent: 33,
        newPrice: 1990000,
        oldPrice: 2990000,
        slug: "nike-killshot-2",
    },
    {
        id: "6",
        name: "Giày Adidas Samba OG White",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_adidas_samba_og_crystal_white_blue_ie916910_5b436e8040274152be96bf6275f281bb_grande.jpg",
        discountPercent: 20,
        newPrice: 2800000,
        oldPrice: 3500000,
        slug: "adidas-samba-og",
    },
];

const ProductGrid = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <section className={styles.gridSection}>
            {/* Tiêu đề */}
            <div className={styles.header}>
                <i className={`bx bxs-zap ${styles.headerIcon}`}></i>
                <h3 className={styles.headerTitle}>Siêu Khuyến Mãi</h3>
            </div>

            {/* Slider */}
            <Slider {...settings} className={styles.productSlider}>
                {sampleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Slider>

            {/* Nút Xem tất cả */}
            <div className={styles.viewAllContainer}>
                <button className={styles.viewAllButton}>Xem tất cả</button>
            </div>
        </section>
    );
};

export default ProductGrid;