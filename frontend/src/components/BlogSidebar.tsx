// src/components/BlogSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import styles from "../styles/BlogSidebar.module.css";
import { BLOG_DATA } from "../types/blogData";
import { ProductDetailData } from "../types/product"; // Import type sản phẩm

// Định nghĩa Props nhận vào
interface BlogSidebarProps {
    products: ProductDetailData[]; // Nhận danh sách sản phẩm thật
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ products }) => {
    // 1. Lấy 4 bài viết mới nhất (Dữ liệu tĩnh từ blogData)
    const recentPosts = BLOG_DATA.slice(0, 4);

    // 2. Lấy 5 sản phẩm đầu tiên từ API để làm "Sản phẩm bán chạy"
    // (Bạn có thể thêm logic lọc sản phẩm hot nếu API hỗ trợ)
    const topProducts = products.slice(0, 5);

    // Hàm format tiền tệ (VND)
    const formatPrice = (price: number | string) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(Number(price));
    };

    return (
        <aside className={styles.sidebar}>
            {/* KHỐI 1: BÀI VIẾT MỚI NHẤT */}
            <div className={styles.widget}>
                <h3 className={styles.widgetTitle}>Bài viết mới nhất</h3>
                <ul className={styles.postList}>
                    {recentPosts.map((post) => (
                        <li key={post.id} className={styles.postItem}>
                            <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                                <div className={styles.postImage}>
                                    <img src={post.thumbnail} alt={post.title} />
                                </div>
                                <div className={styles.postInfo}>
                                    <h4 className={styles.postTitle}>{post.title}</h4>
                                    <span className={styles.postDate}>{post.date}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* KHỐI 2: SẢN PHẨM BÁN CHẠY (DỮ LIỆU THẬT) */}
            <div className={styles.widget}>
                <h3 className={styles.widgetTitle}>Sản phẩm bán chạy</h3>
                <ul className={styles.productList}>
                    {topProducts.map((product) => (
                        <li key={product._id} className={styles.productItem}>
                            {/* Link trỏ đến chi tiết sản phẩm theo SKU variant đầu tiên */}
                            <Link
                                href={`/product/${product.variants[0]?.sku || product._id}`}
                                className={styles.productLink}
                            >
                                <div className={styles.productImage}>
                                    {/* Lấy ảnh đầu tiên của sản phẩm */}
                                    <img
                                        src={product.images[0] || "https://via.placeholder.com/100"}
                                        alt={product.name}
                                    />
                                </div>
                                <div className={styles.productInfo}>
                                    <h4 className={styles.productName}>{product.name}</h4>
                                    <span className={styles.productPrice}>
                                        {/* Ưu tiên hiển thị giá giảm (nếu có), hoặc giá gốc */}
                                        {product.discountPrice
                                            ? formatPrice(product.discountPrice)
                                            : formatPrice(product.basePrice)}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default BlogSidebar;