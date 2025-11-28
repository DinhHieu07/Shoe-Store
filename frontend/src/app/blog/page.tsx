// src/app/blog/page.tsx
import React from "react";
import Link from "next/link";
// Tái sử dụng style card từ NewsSection
import styles from "../../styles/NewsSection.module.css";
// Style layout riêng cho trang Blog
import pageStyles from "../../styles/BlogPage.module.css";
import { BLOG_DATA } from "../../types/blogData"; // <-- IMPORT DỮ LIỆU CHUNG

export default function BlogPage() {
    return (
        <div className={pageStyles.pageContainer}>
            <h1 className={pageStyles.title}>Tin Tức & Bài Viết</h1>

            {/* Hiển thị tất cả bài viết */}
            <div className={pageStyles.blogGrid}>
                {BLOG_DATA.map((article) => (
                    <article key={article.id} className={styles.newsCard}>
                        <div className={styles.newsImageContainer}>
                            <Link href={`/blog/${article.slug}`}>
                                <img
                                    src={article.thumbnail}
                                    alt={article.title}
                                    className={styles.newsImage}
                                />
                            </Link>
                        </div>
                        <div className={styles.newsContent}>
                            <Link
                                href={`/blog/${article.slug}`}
                                className={styles.newsCardLink}
                            >
                                <h3 className={styles.newsCardTitle}>{article.title}</h3>
                            </Link>
                            <p className={styles.newsSnippet}>{article.description}</p>
                            <div className={styles.newsMeta}>
                                <span className={styles.newsDate}>{article.date}</span>
                                <Link
                                    href={`/blog/${article.slug}`}
                                    className={styles.readMoreLink}
                                >
                                    Xem thêm »
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}