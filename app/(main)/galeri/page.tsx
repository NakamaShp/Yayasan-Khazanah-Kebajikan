import { GallerySection } from "@/components/pages/Gallery";
import HeaderPage from "@/components/sections/HeaderPage";
import LazySection from "@/components/utils/LazySection";

export default function GaleriPage() {
  return (
    <>
      <>
        <HeaderPage />
      </>
      <LazySection>
        <GallerySection />
      </LazySection>
    </>
  );
}
