import HeaderPage from "@/components/sections/HeaderPage";
import LazySection from "@/components/utils/LazySection";
import ProgramSection  from "@/components/sections/ProgramSection";

export default function ProgramPage() {
  return (
    <>
      <>
        <HeaderPage />
      </>
      <LazySection>
  
        <ProgramSection />
      </LazySection>
    </>
  );
}
