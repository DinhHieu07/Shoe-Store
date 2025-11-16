// src/app/khuyen-mai/page.tsx

// Import hàm API (giống hệt trang chủ)
import { apiGetProducts } from "../../services/apiProduct";
import { ProductDetailData } from "../../types/product";
// Import component Client mới (sẽ tạo ở bước 3)
import SalePageClient from "../../components/SalePageClient";

// Hàm lấy dữ liệu (Server)
async function getProductsData() {
    try {
        const response = await apiGetProducts();
        return response.products || [];
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        return [];
    }
}

// Trang Server
export default async function SalePage() {
    // 1. Server gọi API lấy TẤT CẢ sản phẩm
    const allProducts: ProductDetailData[] = await getProductsData();

    // 2. Server render component Client và truyền prop
    return (
        <SalePageClient
            initialProducts={allProducts}
            title="Sản Phẩm Khuyến Mãi"
        />
    );
}