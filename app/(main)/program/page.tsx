import HeaderPage from "@/components/sections/HeaderPage";
import LazySection from "@/components/utils/LazySection";
import { ProgramSection } from "@/project-santri/components/sections/Program";

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
