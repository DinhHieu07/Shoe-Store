import PolicyBar from "../components/PolicyBar";
import HeroBanner from "../components/HeroBanner";
import ProductGrid from "@/components/ProductGrid";
import TabbedProductGrid from "@/components/TabbedProductGrid";
import AccessoryHighlights from "@/components/AccessoryHighlights";
import NewsSection from "@/components/NewsSection";
import { apiGetProducts } from "@/services/apiProduct";
import { ProductDetailData } from "@/types/product";

async function getProducts() {
  try {
    const response = await apiGetProducts();
    // Đảm bảo luôn trả về một mảng, ngay cả khi API lỗi hoặc không có products
    return response?.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  return (
    <main>
      <HeroBanner />
      <PolicyBar />
      <ProductGrid products={products} />
      <TabbedProductGrid products={products} />
      <AccessoryHighlights />
      <NewsSection />
    </main>
  );
}