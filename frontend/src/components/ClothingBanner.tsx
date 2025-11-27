// src/components/ClothingBanner.tsx
import React from "react";
import Link from "next/link";
import styles from "../styles/ClothingBanner.module.css";

// Link ảnh MLB Chunky Liner (Tôi tìm được link giống hệt ảnh bạn gửi)
const BANNER_IMAGE_URL =
    "https://file.hstatic.net/200000642007/file/home_banner__1920x825_0_26e3f325f2824a27942edf39cc045e4d.jpg";

// Đường dẫn đến trang quần áo (Bạn có thể đổi link này)
const CLOTHING_PAGE_LINK = "/phu-kien/ao";

const ClothingBanner = () => {
    return (
        <section className={styles.container}>
            <Link
                href={CLOTHING_PAGE_LINK}
                passHref
                className={styles.bannerLink}
            >
                <img
                    src={BANNER_IMAGE_URL}
                    alt="MLB Chunky Liner Banner"
                    className={styles.bannerImage}
                />
            </Link>
        </section>
    );
};

export default ClothingBanner;