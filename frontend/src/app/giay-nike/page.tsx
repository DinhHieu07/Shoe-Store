"use client";

import ProductCard, { Product } from "@/components/ProductCard";
import styles from "@/styles/CategoryPage.module.css";
const nikeProducts: Product[] = [
    {
        _id: "n1",
        name: "Giày Nike Air Force 1 '07",
        imageUrl: "https://product.hstatic.net/200000581855/product/air-force-1-07-lv8-mens-shoes-x9flng.png_99d3aac8e9ed4bf89ad0f36dd0db310d_grande.jpeg",
        discountPercent: 0,
        newPrice: 3850000,
        oldPrice: 3850000,
        slug: "nike-af1-07",
    },
    {
        id: "n2",
        name: "Giày Nike Air Force 1 '07 M All White",
        imageUrl: "https://product.hstatic.net/200000581855/product/air-force-1-07-mens-shoe-j16cjp.png-7_f7aefda6f2ca4636a9fe7b08f695e63b_large.jpeg",
        discountPercent: 18,
        newPrice: 2490000,
        oldPrice: 3050000,
        slug: "nike-af1-all-white",
    },
    {
        id: "n3",
        name: "Giày Nike Air Max 270 React 'White'",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2023/07/Nike-Air-Max-270-White-AH8050-100.jpg",
        discountPercent: 10,
        newPrice: 3990000,
        oldPrice: 4400000,
        slug: "nike-air-max-270-react",
    },
    {
        id: "n4",
        name: "Giày Nike Air Max 90 'White Grey'",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2025/03/Giay-Nike-Air-Max-90-White-College-Grey-Vast-Grey-University-Red-DM0029-113.jpg",
        discountPercent: 15,
        newPrice: 3400000,
        oldPrice: 3990000,
        slug: "nike-air-max-90-white-grey",
    },
    {
        id: "n5",
        name: "Giày Nike Blazer Mid '77 Vintage",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2023/11/Giay-Nike-Blazer-Mid-77-Vintage-Recycled-Wool-Pack-White-Light-Smoke-Grey-CW6726-100-1.jpg",
        discountPercent: 20,
        newPrice: 2800000,
        oldPrice: 3500000,
        slug: "nike-blazer-mid-77-vintage",
    },
    {
        id: "n6",
        name: "Giày Nike React Infinity Run Flyknit 2",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2024/01/Giay-Nike-React-Infinity-Run-Flyknit-Black-Pink-Blast-WMNS-CD4372-009-1.jpg",
        discountPercent: 15,
        newPrice: 4200000,
        oldPrice: 4900000,
        slug: "nike-react-infinity-run-flyknit-2",
    },
    {
        id: "n7",
        name: "Giày Nike Air Zoom Pegasus 37",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2024/09/Giay-Nike-Air-Zoom-Pegasus-41-Coconut-Milk-Pink-HM3703-161.jpg",
        discountPercent: 10,
        newPrice: 3800000,
        oldPrice: 4200000,
        slug: "nike-air-zoom-pegasus-37",
    },
    {
        id: "n8",
        name: "Giày Nike Air Jordan 1 'Panda'",
        imageUrl: "https://sneakerdaily.vn/wp-content/uploads/2023/04/Giay-Nike-Air-Jordan-1-Low-Panda-DC0774-101.jpg",
        discountPercent: 5,
        newPrice: 4500000,
        oldPrice: 4750000,
        slug: "nike-air-jordan-1-panda",
    },
    {
        id: "n9",
        name: "Giày Nike Air Jordan 1 Low White Wolf Grey",
        imageUrl: "https://product.hstatic.net/200000581855/product/giay_nike_air_jordan_1_low_white_wolf_grey_w_dc0774-10511_d4167782465545ecbdcf7ec4439196c6_compact.jpeg",
        discountPercent: 10,
        newPrice: 4200000,
        oldPrice: 4600000,
        slug: "nike-air-jordan-1-low-white-wolf-grey",
    },
    {
        id: "n10",
        name: "Giày Nike Killshot 2 Midnight Navy",
        imageUrl: "https://product.hstatic.net/200000581855/product/killshot-2-leather-mens-shoe-zrq1wk.png_de6c75d6a5dc4e2ea7148aa17661969f_compact.jpeg",
        discountPercent: 10,
        newPrice: 3500000,
        oldPrice: 3900000,
        slug: "nike-killshot-2-midnight-navy",
    },
];

export default function NikePage() {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Giày Nike</h1>
                <div className={styles.sortContainer}>
                    <label htmlFor="sort">Sắp xếp:</label>
                    <select id="sort" className={styles.sortSelect}>
                        <option value="default">Mặc định</option>
                        <option value="price-asc">Giá: Tăng dần</option>
                        <option value="price-desc">Giá: Giảm dần</option>
                        <option value="name-asc">Tên: A-Z</option>
                    </select>
                </div>
            </div>

            <div className={styles.mainContent}>
                {/* Sau này bạn có thể thêm Sidebar (bộ lọc) ở đây */}
                {/* <div className={styles.sidebar}> ... </div> */}

                {/* Lưới sản phẩm */}
                <div className={styles.productGrid}>
                    {nikeProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}