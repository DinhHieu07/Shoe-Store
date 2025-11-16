// src/app/blog/page.tsx
import React from "react";
import Link from "next/link";
// Tái sử dụng style của NewsSection
import styles from "../../styles/NewsSection.module.css";
// Dùng style riêng cho layout trang Blog
import pageStyles from "../../styles/BlogPage.module.css";

// --- DÙNG LẠI MOCK DATA ---
// (Bạn có thể copy/paste mock data từ NewsSection.tsx vào đây)
// (Tôi sẽ thêm 2 bài viết nữa để trang này trông đầy đặn hơn)
const allBlogPosts = [
    {
        _id: "1",
        title: "Top 5 chai xịt nano bảo vệ giày giúp bạn tha hồ đi mưa",
        snippet:
            "Giày dép là một phần không thể thiếu trong tủ đồ của mỗi người.",
        image:
            "https://extrim.vn/_next/image?url=https%3A%2F%2Fextrim-prod.s3.ap-southeast-1.amazonaws.com%2FXit_nano_bao_ve_giay_6a6f563251.jpg&w=1920&q=75",
        date: "27/09/2022",
        slug: "top-5-chai-xit-nano-bao-ve-giay-giup-ban-tha-ho-di-mau",
    },
    {
        _id: "2",
        title: "Cách Đo Chân Để Chọn Size Giày Cho Chuẩn",
        snippet:
            "Có bao giờ bạn băn khoăn về việc mua giày online nhưng không chắc chắn...",
        image:
            "https://extrim.vn/_next/image?url=https%3A%2F%2Fextrim-prod.s3.ap-southeast-1.amazonaws.com%2FTuyet_chieu_giu_giay_luon_nhu_moi_dae7c58525.jpg&w=1920&q=75",
        date: "27/09/2022",
        slug: "cach-do-chan-de-chon-size-giay",
    },
    {
        _id: "3",
        title: "13 cách bảo quản giày toàn diện có thể bạn chưa biết",
        snippet: "Nhiều bạn quan niệm rằng những đôi sneaker khỏe khoắn...",
        image:
            "https://extrim.vn/_next/image?url=https%3A%2F%2Fextrim-prod.s3.ap-southeast-1.amazonaws.com%2Fcach_bao_ve_giay_afd7e7d6c5.jpg&w=1920&q=75",
        date: "27/09/2022",
        slug: "13-cach-bao-quan-giay-toan-dien-co-the-ban-chua-biet",
    },
    {
        _id: "4",
        title: "5 mẹo bảo quản giày bằng nilon chống nước, chống nhựa...",
        snippet: "Nếu không biết cách bảo quản giày, bạn có thể gặp phải...",
        image:
            "https://extrim.vn/_next/image?url=https%3A%2F%2Fextrim-prod.s3.ap-southeast-1.amazonaws.com%2Fthuong_hieu_giay_sneaker_e2e7334fc2.jpeg&w=1920&q=75",
        date: "27/09/2022",
        slug: "5-meo-bao-quan-giay-bang-nilon-chong-nuoc-chong-nham-chong-moc-chong-ri-set",
    },
    {
        _id: "5",
        title: "Cách phân biệt giày thật giả",
        snippet: "Trên thị trường hiện nay, việc phân biệt giày thật và giày giả đang trở nên ngày càng quan trọng...",
        date: "26/09/2022",
        image: "https://bizweb.dktcdn.net/100/413/756/files/tem-giay-nike-chinh-hang-va-fake.jpg?v=1614672793425",
        slug: "cach-phan-biet-giay-that-gia",
    },
];

export default function BlogPage() {
    return (
        // Đây là trang riêng, không có sidebar
        <div className={pageStyles.pageContainer}>
            <h1 className={pageStyles.title}>Tin Tức & Bài Viết</h1>

            {/* Tái sử dụng grid layout (nhưng với class khác) */}
            <div className={pageStyles.blogGrid}>
                {allBlogPosts.map((article) => (
                    // Tái sử dụng style của NewsCard
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
                            <Link
                                href={`/blog/${article.slug}`}
                                className={styles.newsCardLink}
                            >
                                <h3 className={styles.newsCardTitle}>{article.title}</h3>
                            </Link>
                            <p className={styles.newsSnippet}>{article.snippet}</p>
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