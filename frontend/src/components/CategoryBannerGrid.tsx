"use client";

import React from "react";
import Link from "next/link";
import Slider from "react-slick";
import ProductCard, { Product } from "./ProductCard";
import styles from "../styles/CategoryBannerGrid.module.css";
import { useRouter } from "next/navigation";

interface CategoryBannerGridProps {
    title: string;
    bannerImage: string;
    bannerLink: string;
    viewAllLink: string;
    products: Product[];
}

const CategoryBannerGrid: React.FC<CategoryBannerGridProps> = ({
    title,
    bannerImage,
    bannerLink,
    viewAllLink,
    products,
}) => {
    const router = useRouter();
    // Cài đặt cho slider (hiển thị 2 sản phẩm)
    const settings = {
        dots: true,
        infinite: products.length > 2,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <section className={styles.gridBlock}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                <Link href={viewAllLink} className={styles.viewAll}>
                    Xem tất cả »
                </Link>
            </div>

            <div className={styles.content}>
                {/* Banner bên trái */}
                <Link href={bannerLink} passHref className={styles.bannerLink}>
                    <img
                        src={bannerImage}
                        alt={title}
                        className={styles.bannerImage}
                    />
                </Link>

                {/* Slider sản phẩm bên phải */}
                <div className={styles.productSlider}>
                    <Slider {...settings}>
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} onClick={() => router.push(`/product/${product.slug}`)} />
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default CategoryBannerGrid;