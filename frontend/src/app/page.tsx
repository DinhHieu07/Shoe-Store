import PolicyBar from "../components/PolicyBar";
import HeroBanner from "../components/HeroBanner";
import ProductGrid from "@/components/ProductGrid";
import TabbedProductGrid from "@/components/TabbedProductGrid";
import AccessoryHighlights from "@/components/AccessoryHighlights";
import NewsSection from "@/components/NewsSection";
import ClothingBanner from "@/components/ClothingBanner";

export default async function Home() {
  return (
    <main>
      <HeroBanner />
      <PolicyBar />
      <ProductGrid />
      <TabbedProductGrid />
      <AccessoryHighlights />
      <ClothingBanner />
      <NewsSection />
    </main>
  );
}