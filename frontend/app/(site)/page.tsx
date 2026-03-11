import HeroSection from "./components/HeroSection";
import FeaturedProperties from "./components/FeaturedProperties";
import StatsSection from "./components/StatsSection";
import PropertyTypes from "./components/PropertyTypes";
import AboutSection from "./components/AboutSection";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedProperties />
      <StatsSection />
      <PropertyTypes />
      <AboutSection />
      <CTASection />
    </main>
  );
}
