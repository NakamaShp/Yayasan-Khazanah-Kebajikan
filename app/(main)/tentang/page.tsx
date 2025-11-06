
import AboutGoals from "@/components/sections/About/AboutGoals";
import AboutIntro from "@/components/sections/About/AboutIntro";
import AboutVisionMission from "@/components/sections/About/AboutVisionMission";
import HeaderPage from "@/components/sections/HeaderPage";
import LazySection from "@/components/utils/LazySection";

export default function AboutPage() {
  return (
    <>
      <>
        <HeaderPage />
      </>
      <LazySection>
        <AboutIntro />
        <AboutVisionMission />
        <AboutGoals />
      </LazySection>
    </>
  );
}
