import HalamanDonasi from "@/components/pages/Donasi/donasipublic";
import HeaderPage from "@/components/sections/HeaderPage";
import LazySection from "@/components/utils/LazySection";

export default function DonasiPage() {
  return (
    <>
      <>
        <HeaderPage />
      </>
      <LazySection>
        <main className="mt-20">
          <HalamanDonasi />
        </main>
      </LazySection>
    </>
  );
}
