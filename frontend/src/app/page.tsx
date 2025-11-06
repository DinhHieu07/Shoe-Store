import PolicyBar from "../components/PolicyBar";
import HeroBanner from "../components/HeroBanner";
import ProductGrid from "@/components/ProductGrid";
import TabbedProductGrid from "@/components/TabbedProductGrid";
import AccessoryHighlights from "@/components/AccessoryHighlights";
import ClothingBanner from "@/components/ClothingBanner";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <PolicyBar />
      <ProductGrid />
      <TabbedProductGrid />
      <AccessoryHighlights />
      <ClothingBanner />
    </main>
  );
}