"use client";

import ProductCard, { Product } from "@/components/ProductCard";
import styles from "@/styles/CategoryPage.module.css";
const nikeProducts: Product[] = [
    {
        _id: "n1",
        name: "Giày Nike Air Force 1 '07",
        images: ["https://product.hstatic.net/200000581855/product/air-force-1-07-lv8-mens-shoes-x9flng.png_99d3aac8e9ed4bf89ad0f36dd0db310d_grande.jpeg"],
        discountPercent: 0,
        basePrice: 3850000,
        discountPrice: 3850000,
        slug: "nike-af1-07",
    },
    {
        _id: "n2",
        name: "Giày Nike Air Force 1 '07 M All White",
        images: ["https://product.hstatic.net/200000581855/product/air-force-1-07-mens-shoe-j16cjp.png-7_f7aefda6f2ca4636a9fe7b08f695e63b_large.jpeg"],
        discountPercent: 18,
        basePrice: 2490000,
        discountPrice: 2490000,
        slug: "nike-af1-all-white",
    },
    {
        _id: "n3",
        name: "Giày Nike Air Max 270 React 'White'",
        images: ["https://sneakerdaily.vn/wp-content/uploads/2023/07/Nike-Air-Max-270-White-AH8050-100.jpg"],
        discountPercent: 10,
        basePrice: 3990000,
        discountPrice: 4400000,
        slug: "nike-air-max-270-react",
    },
    {
        _id: "n4",
        name: "Giày Nike Air Max 90 'White Grey'",
        images: ["https://sneakerdaily.vn/wp-content/uploads/2025/03/Giay-Nike-Air-Max-90-White-College-Grey-Vast-Grey-University-Red-DM0029-113.jpg"],
        discountPercent: 15,
        basePrice: 3400000,
        discountPrice: 3990000,
        slug: "nike-air-max-90-white-grey",
    },
    {
        _id: "n5",
        name: "Giày Nike Blazer Mid '77 Vintage",
        images: ["https://sneakerdaily.vn/wp-content/uploads/2023/11/Giay-Nike-Blazer-Mid-77-Vintage-Recycled-Wool-Pack-White-Light-Smoke-Grey-CW6726-100-1.jpg"],
        discountPercent: 20,
        basePrice: 2800000,
        discountPrice: 3500000,
        slug: "nike-blazer-mid-77-vintage",
    },
    {
        _id: "n6",
        name: "Giày Nike React Infinity Run Flyknit 2",
        images: ["https://sneakerdaily.vn/wp-content/uploads/2024/01/Giay-Nike-React-Infinity-Run-Flyknit-Black-Pink-Blast-WMNS-CD4372-009-1.jpg"],
        discountPercent: 15,
        basePrice: 4200000,
        discountPrice: 4900000,
        slug: "nike-react-infinity-run-flyknit-2",
    },
    {
        _id: "n7",
        name: "Giày Nike Air Zoom Pegasus 37",
        images: ["https://sneakerdaily.vn/wp-content/uploads/2024/09/Giay-Nike-Air-Zoom-Pegasus-41-Coconut-Milk-Pink-HM3703-161.jpg"],
        discountPercent: 10,
        basePrice: 3800000,
        discountPrice: 4200000,
        slug: "nike-air-zoom-pegasus-37",
    },
    {
        _id: "n8",
        name: "Giày Nike Air Jordan 1 'Panda'",
        images: ["https://sneakerdaily.vn/wp-content/uploads/2023/04/Giay-Nike-Air-Jordan-1-Low-Panda-DC0774-101.jpg"],
        discountPercent: 5,
        basePrice: 4500000,
        discountPrice: 4750000,
        slug: "nike-air-jordan-1-panda",
    },
    {
        _id: "n9",
        name: "Giày Nike Air Jordan 1 Low White Wolf Grey",
        images: ["https://product.hstatic.net/200000581855/product/giay_nike_air_jordan_1_low_white_wolf_grey_w_dc0774-10511_d4167782465545ecbdcf7ec4439196c6_compact.jpeg"],
        discountPercent: 10,
        basePrice: 4200000,
        discountPrice: 4600000,
        slug: "nike-air-jordan-1-low-white-wolf-grey",
    },
    {
        _id: "n10",
        name: "Giày Nike Killshot 2 Midnight Navy",
        images: ["https://product.hstatic.net/200000581855/product/killshot-2-leather-mens-shoe-zrq1wk.png_de6c75d6a5dc4e2ea7148aa17661969f_compact.jpeg"],
        discountPercent: 10,
        basePrice: 3500000,
        discountPrice: 3900000,
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
                        <ProductCard key={product._id} product={product} onClick={() => {}} />
                    ))}
                </div>
            </div>
        </div>
    );
}