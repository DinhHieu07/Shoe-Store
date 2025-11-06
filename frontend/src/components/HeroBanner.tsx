"use client";
import React from "react";
import Slider from "react-slick";
import styles from "../styles/HeroBanner.module.css"; // Import file style module
import Link from "next/link";
// Danh sách các ảnh banner
const bannerImages = [
    {
        id: 1,
        alt: "Nike Banner",
        url: "https://file.hstatic.net/200000581855/file/banner_2_7f759d8e36d34b30b998978830194a14_master.png",
        href: "/giay-nike",
    },
    {
        id: 2,
        alt: "Adidas Banner",
        url: "https://file.hstatic.net/200000581855/file/banner_dee_1_90ef7d3fc91c433bb39aee85e4a26c37_master.png",
        href: "/giay-adidas",
    },
    {
        id: 3,
        alt: "MLB Banner",
        url: "https://bizweb.dktcdn.net/100/413/756/collections/mlb2.jpg?v=1617462156470",
        href: "/giay-mlb",
    },
];

const HeroBanner = () => {
    // Cài đặt cho slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <section className={styles.bannerContainer}>
            <Slider {...settings}>
                {bannerImages.map((image) => (
                    <Link key={image.id} href={image.href} passHref>
                        <div
                            className={styles.slideItem}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                className={styles.slideImage}
                            />
                        </div>
                    </Link>
                ))}
            </Slider>
        </section>
    );
};

export default HeroBanner;