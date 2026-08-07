import HeroSection from "@/common/home/HeroSection";
import AboutSection from "@/common/home/AboutSection";
import ProjectSection from "@/common/home/ProjectSection";
import CommunitySection from "@/common/home/CommunitySection";
import GallerySection from "@/common/home/GallerySection";
import TeamSection from "@/common/home/TeamSection";
import FAQSection from "@/common/home/FAQSection";
import ContactSection from "@/common/home/ContactSection";
import FooterSection from "@/common/home/FooterSection";
import NoiseCard from "@/common/noise-card/NoiseCard";

export default function Home() {
  return (
    <main className=" overflow-hidden  ">
      <NoiseCard
        className=" rounded-[26px] border border-white/8  shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-md "
        bgColor="bg-[#000000]"
        noiseOpacity={0.1}
        grainSize={1}
      >
       <div className="mx-auto max-w-[1440px]  ">
         <HeroSection />
         <ProjectSection />
         <CommunitySection />
         <GallerySection />
         <TeamSection />
         <FAQSection />
         <AboutSection />
         <ContactSection />
         <FooterSection />
       </div>
      </NoiseCard>
    </main>

  );
}

