"use client";

import React from "react";
import Link from "next/link";
import styles from "../styles/NewsSection.module.css";

interface NewsArticle {
    _id: string;
    title: string;
    snippet: string;
    image: string;
    date: string;
    slug: string;
}

const newsArticles: NewsArticle[] = [
    {
        _id: "1",
        title: "Top 5 chai xịt nano bảo vệ giày giúp bạn tha hồ đi mưa",
        snippet: "Giày dép là một phần không thể thiếu trong tủ đồ của mỗi người. Đặc biệt, những đôi giày yêu thích không chỉ...",
        image: "https://naidecor.vn/wp-content/uploads/2020/08/BST-GD-02.jpg",
        date: "27/09/2022",
        slug: "top-5-chai-xit-nano-bao-ve-giay-giup-ban-tha-ho-di-mau"
    },
    {
        _id: "2",
        title: "Cách Đo Chân Để Chọn Size Giày Cho Chuẩn",
        snippet: "Có bao giờ bạn băn khoăn về việc mua giày online nhưng không chắc chắn đôi chân mìn...",
        image: "https://www.elle.vn/app/uploads/2019/06/12/giay-sneakers-mau-do-den-truoc-anh-mat-troi-2.jpg",
        date: "27/09/2022",
        slug: "cach-do-chan-de-chon-size-giay"
    },
    {
        _id: "3",
        title: "13 cách bảo quản giày toàn diện có thể bạn chưa biết",
        snippet: "Nhiều bạn quan niệm rằng những đôi sneaker khỏe khoắn có thể làm mất đi nét nữ tính và...",
        image: "https://www.chapi.vn/img/article/2017/8/28/6-mau-sneakers-chua-bao-gio-loi-thoi-new.jpg",
        date: "27/09/2022",
        slug: "13-cach-bao-quan-giay-toan-dien-co-the-ban-chua-biet"
    },
    {
        _id: "4",
        title: "5 mẹo bảo quản giày bằng nilon chống nước, chống nhựa, chống mốc, chống rỉ sét",
        snippet: "Nếu không biết cách bảo quản giày, bạn có thể gặp phải những vấn đề như: giày bị mốc, giày bị rỉ sét, giày bị nhựa...",
        image: "https://myshoes.vn/image/catalog/blog/26.11/mau-giay-the-thao-nam.jpeg",
        date: "27/09/2022",
        slug: "5-meo-bao-quan-giay-bang-nilon-chong-nuoc-chong-nham-chong-moc-chong-ri-set"
    },
];

const NewsSection = () => {
    return (
        <section className={styles.newsContainer}>
            <h2 className={styles.newsTitle}>TIN TỨC</h2>
            <div className={styles.newsGrid}>
                {newsArticles.map((article) => (
                    <article key={article._id} className={styles.newsCard}>
                        <div className={styles.newsImageContainer}>
                            <Link href={`/blog/${article.slug}`}>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className={styles.newsImage}
                                />
                            </Link>
                        </div>
                        <div className={styles.newsContent}>
                            <Link href={`/blog/${article.slug}`} className={styles.newsCardLink}>
                                <h3 className={styles.newsCardTitle}>{article.title}</h3>
                            </Link>
                            <p className={styles.newsSnippet}>{article.snippet}</p>
                            <div className={styles.newsMeta}>
                                <span className={styles.newsDate}>{article.date}</span>
                                <Link href={`/blog/${article.slug}`} className={styles.readMoreLink}>
                                    Xem thêm »
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default NewsSection;