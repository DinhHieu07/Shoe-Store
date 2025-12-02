// src/app/[...slug]/page.tsx
import CategoryPageClient from "../../components/CategoryPageClient";
import { apiGetProducts } from "../../services/apiProduct"; // <-- API DỮ LIỆU THẬT
import { ProductDetailData } from "../../types/product";

// --- DỮ LIỆU GIẢ (MOCK DATA) CHO PHỤ KIỆN ---
// Chúng ta định nghĩa dữ liệu này theo đúng interface `ProductDetailData`
const MOCK_ACCESSORIES: ProductDetailData[] = [
    // --- MOCK DATA CHO TÚI ---
    {
        _id: "mock-tui-1",
        slug: "balo-mlb-mini-monogram",
        name: "Balo MLB Mini Monogram ",
        brand: "MLB",
        basePrice: "2250000",
        images: ["https://product.hstatic.net/200000581855/product/balo_mlb_mini_monogram_jacquard_boston_red_sox_7abkm032n-43bgs5_769c1f8b0e334125a35b8c8419acda23_large.jpg"],
        category: "Túi", // <-- Quan trọng: Category phải khớp
        categoryIds: [],
        description: "Mô tả cho balo mock",
        variants: [
            {
                sku: "MOCK-TUI-01",
                size: "One Size",
                color: "Beige",
                price: "1750000",
                stock: "10",
            },
        ],
        discountCodes: [],
        discountPercent: 22,
        discountPrice: 1750000,
    },
    // --- MOCK DATA CHO NÓN ---
    {
        _id: "mock-non-1",
        slug: "mu-mlb-basic-flex-mesh",
        name: "Mũ MLB Basic Flex Mesh ",
        brand: "MLB",
        basePrice: "850000",
        images: ["https://product.hstatic.net/200000581855/product/basic-flex-mesh-cap-32cp74111-50l-mau-den-62b034843aa70-20062022154908_bd7a8c92a6364dfab51287cab4162274_grande.jpg"],
        category: "Nón", // <-- Quan trọng: Category phải khớp (Nón hoặc Mũ)
        categoryIds: [],
        description: "Mô tả cho mũ mock",
        variants: [
            {
                sku: "MOCK-NON-01",
                size: "One Size",
                color: "Black",
                price: "850000",
                stock: "10",
            },
        ],
        discountCodes: [],
        discountPercent: 0,
        discountPrice: 850000,
    },
    // --- MOCK DATA CHO ÁO ---
    {
        _id: "mock-ao-1",
        slug: "ao-phong-mlb-monogram",
        name: "Áo Phông MLB Monogram ",
        brand: "MLB",
        basePrice: "1200000",
        images: ["https://product.hstatic.net/200000581855/product/ao_mlb_monogram_all_over_over_fit_short_sleeve_black_31tsm1131-50l5_9ec9f611349341f19b31431dc62d8c42_large.png"],
        category: "Áo", // <-- Quan trọng: Category phải khớp
        categoryIds: [],
        description: "Mô tả cho áo mock",
        variants: [
            {
                sku: "MOCK-AO-01",
                size: "M",
                color: "White",
                price: "1200000",
                stock: "10",
            },
        ],
        discountCodes: [],
        discountPercent: 0,
        discountPrice: 1200000,
    },
];
// (Hãy đảm bảo "Túi", "Nón", "Áo" khớp với file CategoryPageClient.tsx)

// --- HÀM LẤY DỮ LIỆU (ĐÃ CHỈNH SỬA) ---
async function getProductsData() {
    let realShoeData: ProductDetailData[] = [];
    try {
        // 1. Lấy dữ liệu thật (Giày) từ database
        const response = await apiGetProducts();
        realShoeData = response.products || [];
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thật:", error);
        // Tiếp tục chạy dù bị lỗi, để ít nhất vẫn hiển thị được mock data
    }

    // 2. Kết hợp dữ liệu thật và dữ liệu giả
    const allProducts = [...realShoeData, ...MOCK_ACCESSORIES];

    return allProducts;
}

// --- TRANG SERVER (Giữ nguyên) ---
interface PageProps {
    params: {
        slug: string[]; // slug là một mảng
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    // 3. Lấy TẤT CẢ sản phẩm (thật + giả)
    const allProducts = await getProductsData();

    // 4. Truyền mảng đã gộp xuống Client
    return (
        <CategoryPageClient initialProducts={allProducts} slugParts={slug} />
    );
}