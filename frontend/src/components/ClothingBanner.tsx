// src/components/ClothingBanner.tsx
import React from "react";
import Link from "next/link";
import styles from "../styles/ClothingBanner.module.css";

// Link ảnh MLB Chunky Liner
const BANNER_IMAGE_URL =
    "https://file.hstatic.net/200000581855/file/banner__pc_duoi_0dd701b53370412e8c12b5e8c1fccc2f_2048x2048.png";

// Đường dẫn đến trang quần áo 
const CLOTHING_PAGE_LINK = "/giay-mlb";

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