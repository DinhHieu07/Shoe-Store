// src/app/blog/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import { BLOG_DATA } from "../../../types/blogData";
import styles from "../../../styles/BlogPost.module.css";
import BlogSidebar from "../../../components/BlogSidebar";

// Import API và Type
import { apiGetProducts } from "../../../services/apiProduct";
import { ProductDetailData } from "../../../types/product";
import Link from "next/link";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    return BLOG_DATA.map((post) => ({
        slug: post.slug,
    }));
}

// Hàm lấy sản phẩm từ API (Server-side)
async function getProductsData() {
    try {
        const response = await apiGetProducts();
        return response.products || [];
    } catch (error) {
        console.error("Lỗi lấy sản phẩm cho sidebar:", error);
        return [];
    }
}

export default async function BlogPostDetail({ params }: PageProps) {
    const { slug } = await params;
    const post = BLOG_DATA.find((p) => p.slug === slug);

    // Gọi API lấy danh sách sản phẩm thật
    const products: ProductDetailData[] = await getProductsData();

    if (!post) {
        return notFound();
    }

    return (
        <div className={styles.postContainer}>
            <div className={styles.layoutWrapper}>

                {/* CỘT TRÁI: SIDEBAR (Truyền products thật vào đây) */}
                <div className={styles.leftColumn}>
                    <BlogSidebar products={products} />
                </div>

                {/* CỘT PHẢI: NỘI DUNG BÀI VIẾT (Giữ nguyên) */}
                <div className={styles.rightColumn}>
                    <div className={styles.breadcrumb}>
                        <Link href="/">Trang chủ</Link> / <Link href="/blog">Blog</Link> / <span>{post.title}</span>
                    </div>

                    <article className={styles.article}>
                        <header className={styles.header}>
                            <h1 className={styles.title}>{post.title}</h1>

                        </header>

                        <div className={styles.featuredImage}>
                            <img src={post.thumbnail} alt={post.title} />
                        </div>

                        <div
                            className={styles.content}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <div className={styles.tags}>
                            Tags: #GiaySneaker #BaoQuanGiay #MeoVat
                        </div>
                    </article>
                </div>

            </div>
        </div>
    );
}