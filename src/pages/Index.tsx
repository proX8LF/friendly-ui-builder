import ThemeToggle from "@/components/ThemeToggle";
import Hero from "@/components/landing/Hero";
import ModelShowcase from "@/components/landing/ModelShowcase";
import FeatureCards from "@/components/landing/FeatureCards";
import ShowcasePreview from "@/components/landing/ShowcasePreview";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dot-grid">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <span className="text-sm font-bold text-foreground tracking-tight">⚡ AI Vibe Coder</span>
          <ThemeToggle />
        </div>
      </nav>

      <Hero />
      <ModelShowcase />
      <FeatureCards />
      <ShowcasePreview />
      <Footer />
    </div>
  );
};

export default Index;
